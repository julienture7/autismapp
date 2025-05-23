import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, BarChart, PlusCircle, Award } from 'lucide-react';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch the user's profiles
  const profiles = await db.profile.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          chatSessions: true,
          achievements: true,
        },
      },
    },
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
    take: 3,
  });

  // Fetch recent achievements
  const recentAchievements = await db.achievement.findMany({
    where: {
      profile: {
        userId: session.user.id,
      },
    },
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name || 'Parent'}</h1>
          <p className="text-muted-foreground">
            Manage your child's profiles and track their progress with WonderChat.
          </p>
        </div>

        {profiles.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your first child profile to start using WonderChat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                WonderChat helps children develop communication and social skills through interactive
                conversations with our AI companion. Create a profile to get started!
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/profiles/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <>
            {/* Quick actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/dashboard/chat" className="contents">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg font-medium">Start a Chat</CardTitle>
                    <MessageSquare className="h-5 w-5 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Begin a new conversation with WonderChat using voice or text.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/profiles" className="contents">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg font-medium">Manage Profiles</CardTitle>
                    <Users className="h-5 w-5 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Create, edit or view child profiles and their settings.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/progress" className="contents">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg font-medium">View Progress</CardTitle>
                    <BarChart className="h-5 w-5 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Track your child's progress and achievements over time.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Child profiles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Child Profiles
                    <Link href="/dashboard/profiles/create">
                      <Button variant="ghost" size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profiles.slice(0, 3).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <Link href={`/dashboard/profiles/${profile.id}`}>
                            <h3 className="font-medium hover:underline">{profile.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {profile.age} years old • {profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{profile._count.chatSessions} Chats</p>
                            <p className="text-sm">{profile._count.achievements} Achievements</p>
                          </div>
                          <Link href={`/dashboard/profiles/${profile.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        </div>
                      </div>
                    ))}

                    {profiles.length > 3 && (
                      <Link href="/dashboard/profiles">
                        <Button variant="link" className="w-full">View all profiles</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-yellow-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentAchievements.length > 0 ? (
                    <div className="space-y-4">
                      {recentAchievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-3 border-b pb-3">
                          <div className="bg-yellow-100 p-2 rounded-full text-yellow-700">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs mt-1">
                              Earned by {achievement.profile.name} on{' '}
                              {new Date(achievement.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No achievements yet.</p>
                      <p className="text-sm mt-1">
                        Achievements will appear as your child interacts with WonderChat.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/progress">
                    <Button variant="outline" size="sm">View All Progress</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </>
        )}

        {/* Recent activity */}
        {recentSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Chat Sessions</CardTitle>
              <CardDescription>
                Recent conversations with WonderChat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">
                        Session with {session.profile?.name || 'Unknown Child'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {session._count.messages} messages •
                        {new Date(session.updatedAt).toLocaleDateString()} at
                        {' '}{new Date(session.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/chat/${session.id}`}>
                      <Button size="sm">Continue</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/chat">
                <Button variant="outline">View All Chat Sessions</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
