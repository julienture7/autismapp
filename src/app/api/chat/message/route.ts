import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  generateChatResponse,
  getSystemInstructions
} from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { message, sessionId, profileId, audioBase64 } = body;

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    // Get profile information for context
    const profile = await db.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get or create chat session
    let chatSession;
    if (sessionId) {
      chatSession = await db.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      if (!chatSession) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }
    } else {
      chatSession = await db.chatSession.create({
        data: {
          profileId,
          userId: session.user.id,
        },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    // Save the user message to the database
    const userMessage = await db.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        content: message || (audioBase64 ? '(Audio message)' : ''),
        role: 'user',
        audioBase64: audioBase64 || null,
      },
    });

    // Format conversation history for the AI
    const conversationHistory = [
      ...chatSession.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        parts: msg.content,
      })),
      {
        role: 'user',
        parts: message || (audioBase64 ? '(Audio message)' : ''),
      }
    ];

    // Get system instructions based on profile type
    const systemInstruction = getSystemInstructions(
      profile.type,
      profile.name,
      profile.age
    );

    // Generate AI response using Gemini
    const aiResponseText = await generateChatResponse(
      conversationHistory,
      message || (audioBase64 ? '(The user sent an audio message which I cannot hear)' : '')
    );

    // Save the AI response to the database
    const aiMessage = await db.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        content: aiResponseText,
        role: 'assistant',
      },
    });

    // Return the response
    return NextResponse.json({
      message: aiResponseText,
      sessionId: chatSession.id,
      messageId: aiMessage.id,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
