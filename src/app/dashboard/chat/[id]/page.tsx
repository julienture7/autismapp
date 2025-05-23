import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ClientPage from './client-page';
import { use } from 'react';
import Link from 'next/link';

export default function ChatPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params with React.use() - this must remain outside try/catch
  const resolvedParams = use(params as Promise<{ id: string }>);
  const chatSessionId = resolvedParams.id;

  // Unwrap session with React.use() - this must remain outside try/catch
  const session = use(getServerSession(authOptions));

  // Check authentication
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch the chat session details - this must remain outside try/catch
  const chatSession = use(
    db.chatSession.findUnique({
      where: {
        id: chatSessionId,
        userId: session.user.id,
      },
      include: {
        profile: true,
      },
    })
  );

  // Now we can use normal conditionals to handle the case where chatSession is null
  if (!chatSession) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Chat Session Not Found</h3>
          <p className="text-red-600 mb-4">
            The requested chat session could not be found or you don't have access to it.
          </p>
          <p className="text-slate-600 text-sm mb-4">
            This might happen if:
            <ul className="list-disc pl-5 mt-2">
              <li>The chat session has expired</li>
              <li>The URL is incorrect</li>
              <li>You don't have permission to access this chat</li>
            </ul>
          </p>
        </div>
        <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // If we get here, we have a valid chat session
  return (
    <div className="container mx-auto py-4 h-[calc(100vh-4rem)]">
      <ClientPage
        profileId={chatSession.profileId}
        profileName={chatSession.profile.name}
        profileType={chatSession.profile.type}
        sessionId={chatSession.id}
      />
    </div>
  );
}
