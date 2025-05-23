import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Model names
export const TEXT_MODEL = 'gemini-1.5-flash';
export const CHAT_MODEL = 'gemini-1.5-flash';
export const LIVE_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';

// Text generation
export async function generateTextResponse(prompt: string): Promise<string> {
  try {
    if (!genAI) {
      throw new Error('Gemini API client not initialized');
    }
    const model = genAI.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text response:', error);
    return 'Sorry, I had trouble processing that. Please try again.';
  }
}

// Chat interface
export async function generateChatResponse(
  history: { role: 'user' | 'model'; parts: string }[],
  prompt: string
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error('Gemini API client not initialized');
    }
    const model = genAI.getGenerativeModel({ model: CHAT_MODEL });
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'Sorry, I had trouble processing that. Please try again.';
  }
}

// For frontend use with the Live API - updated to use a safer approach
export function getGeminiApiKey(): string {
  // This is a client-side function, so we'll use an approach that works in the browser
  // We should never expose API keys directly in client-side code
  return ''; // Return empty string on client side - we'll get the key via API
}

// New function to safely get the API key from the server
export async function fetchGeminiApiKey(): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch API key');
    }

    const data = await response.json();
    return data.apiKey || '';
  } catch (error) {
    console.error('Error fetching Gemini API key:', error);
    return '';
  }
}

// Convert audio to base64 for API
export async function audioToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Extract the base64 part (remove the data URL prefix)
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      reject(error);
    }
  });
}

// System instructions for different profiles
export function getSystemInstructions(profileType: string, childName: string = '', childAge: number = 0): string {
  const baseInstructions = `You are WonderChat, a friendly AI assistant designed to help children develop communication and social skills.`;

  switch (profileType) {
    case 'autism':
      return `${baseInstructions} You're speaking with ${childName}, who is ${childAge} years old and has autism.
        Use clear, concrete language and avoid idioms or metaphors.
        Be patient and give them time to respond.
        Focus on their interests and strengths.
        Provide visual descriptions when possible.
        Keep sentences short and direct.
        Use a calm, supportive tone.`;

    case 'adhd':
      return `${baseInstructions} You're speaking with ${childName}, who is ${childAge} years old and has ADHD.
        Keep conversations engaging but structured.
        Break information into smaller chunks.
        Be patient if they shift topics quickly.
        Ask specific questions rather than open-ended ones.
        Provide positive reinforcement for staying on topic.
        Use an energetic but focused tone.`;

    case 'social_skills':
      return `${baseInstructions} You're speaking with ${childName}, who is ${childAge} years old and is working on social skills.
        Help them practice conversations by asking questions.
        Model polite responses and turn-taking.
        Gently suggest how they might respond in social situations.
        Provide positive feedback for appropriate social exchanges.
        Use a friendly, encouraging tone.`;

    default:
      return `${baseInstructions} You're speaking with a child. Use simple language, be patient, and focus on making the conversation fun and educational. Be encouraging and positive in all interactions.`;
  }
}
