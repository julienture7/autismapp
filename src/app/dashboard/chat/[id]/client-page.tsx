'use client';

import { useEffect, useState } from 'react';
import { ChatInterface } from '@/components/ui/chat-interface';
import { fetchGeminiApiKey } from '@/lib/gemini';

interface ClientPageProps {
  profileId: string;
  profileName: string;
  profileType: string;
  sessionId?: string;
}

export default function ClientPage({
  profileId,
  profileName,
  profileType,
  sessionId
}: ClientPageProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get API key for Gemini from server
    async function getApiKey() {
      try {
        const key = await fetchGeminiApiKey();
        if (!key) {
          setError('No Gemini API key found. Please configure your environment variables.');
        } else {
          setApiKey(key);
        }
      } catch (err) {
        console.error('Error fetching API key:', err);
        setError('Failed to fetch Gemini API key. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    getApiKey();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <ChatInterface
          profileId={profileId}
          profileName={profileName}
          profileType={profileType}
          sessionId={sessionId}
          apiKey={apiKey}
        />
      </div>
    </div>
  );
}
