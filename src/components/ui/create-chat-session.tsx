'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type CreateChatSessionProps = {
  profileId: string;
  children: React.ReactNode;
  className?: string;
};

export function CreateChatSession({ profileId, children, className }: CreateChatSessionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create chat session');
      }

      const data = await response.json();

      // Navigate to the new chat session
      router.push(`/dashboard/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Failed to create chat session:', error);
      toast.error('Failed to create chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={className}
      onClick={handleCreateSession}
      style={{ cursor: isLoading ? 'wait' : 'pointer' }}
    >
      {children}
    </div>
  );
}
