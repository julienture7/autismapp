import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { CreateChatSession } from '@/components/ui/create-chat-session';

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch the user's profiles
  const profiles = await db.profile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch recent chat sessions
  const recentSessions = await db.chatSession.findMany({
    where: { userId: session.user.id },
    include: {
      profile: true,
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chat Sessions</h1>
          <p className="text-muted-foreground">
            Start a new chat or continue an existing conversation.
          </p>
        </div>

        {profiles.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Create a Profile First</CardTitle>
              <CardDescription>
                You need to create a child profile before starting a chat session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                WonderChat personalizes conversations based on a child's profile information.
                Create a profile to get started!
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/profiles/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Start a New Chat</CardTitle>
                <CardDescription>
                  Choose a profile to start a new conversation with WonderChat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {profiles.map((profile) => (
                    <Card key={profile.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription>
                          {profile.age} years old • {profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <CreateChatSession profileId={profile.id} className="w-full">
                          <Button className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Start Chat
                          </Button>
                        </CreateChatSession>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {recentSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Chat Sessions</CardTitle>
                  <CardDescription>
                    Continue a previous conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="font-medium">
                            Chat with {session.profile?.name || 'Unknown Child'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session._count.messages} messages •{' '}
                            {new Date(session.updatedAt).toLocaleDateString()} at{' '}
                            {new Date(session.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Link href={`/dashboard/chat/${session.id}`}>
                          <Button size="sm">Continue</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
