import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return the API key
  return NextResponse.json({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY || ''
  });
}
