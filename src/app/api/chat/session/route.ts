import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Create a new chat session for a profile
export async function POST(req: NextRequest) {
  try {
    // Ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile ID from request body
    const { profileId } = await req.json();

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    // Verify the profile belongs to the user
    const profile = await db.profile.findUnique({
      where: {
        id: profileId,
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found or access denied' }, { status: 404 });
    }

    // Create a new chat session
    const chatSession = await db.chatSession.create({
      data: {
        userId: session.user.id,
        profileId: profileId,
      },
    });

    // Create initial welcome message
    await db.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        content: `Hi ${profile.name}! I'm WonderChat. How are you feeling today?`,
        role: 'assistant',
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: chatSession.id,
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}
