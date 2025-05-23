"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainLayout from "@/components/layouts/main-layout";
import { CreateChatSession } from "@/components/ui/create-chat-session";

interface ProgressItem {
  id: string;
  category: string;
  skill: string;
  level: number;
  points: number;
  description: string;
}

interface ProfileData {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  progressItems: ProgressItem[];
  achievements: any[];
  chatSessions: any[];
}

// Next.js 15: params is a Promise in client components, so we must resolve it
export default function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Resolve params as a Promise (Next.js 15 client component convention)
    async function resolveParamsAndFetch() {
      try {
        const resolvedParams = await props.params;
        if (!resolvedParams?.id) {
          throw new Error("Profile ID not found in params");
        }
        if (isMounted) setProfileId(resolvedParams.id);

        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }

        if (status === "authenticated") {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/profiles/${resolvedParams.id}`);
            if (!response.ok) {
              throw new Error("Failed to fetch profile data");
            }
            const data = await response.json();
            if (isMounted) setProfileData(data.profile);
          } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Error loading profile data");
          } finally {
            if (isMounted) setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error resolving params:", error);
        toast.error("Error loading profile data");
        if (isMounted) setIsLoading(false);
      }
    }

    resolveParamsAndFetch();

    return () => {
      isMounted = false;
    };
    // We intentionally do not include profileId in deps, as it is set here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.params, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-180px)] flex justify-center items-center">
          <p className="text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!profileData) {
    return (
      <MainLayout>
        <div className="px-6 py-12 md:px-20 lg:px-40 gradient-bg min-h-[calc(100vh-180px)]">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-3xl font-bold mb-4 secondary-text">Profile Not Found</h1>
            <p className="mb-6 text-slate-700">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/dashboard">
              <Button className="primary-bg text-white">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatProgressCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSkillName = (skill: string) => {
    return skill
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getProgressColor = (level: number) => {
    switch (level) {
      case 1: return "bg-slate-200";
      case 2: return "bg-blue-200";
      case 3: return "bg-teal-200";
      case 4: return "bg-green-200";
      case 5: return "bg-yellow-200";
      default: return "bg-slate-200";
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-12 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 secondary-text">
                {profileData.name}'s Profile
              </h1>
              <p className="text-slate-700">Age: {profileData.age} • Created {new Date(profileData.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <CreateChatSession profileId={profileData.id}>
                <Button className="primary-bg text-white">Start Chat</Button>
              </CreateChatSession>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg secondary-text">Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold primary-text">
                  {profileData.chatSessions?.length || 0}
                </div>
                <p className="text-sm text-slate-600">Total conversations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg secondary-text">Progress Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold primary-text">
                  {Math.round(profileData.progressItems.reduce((acc, item) => acc + item.level, 0) / profileData.progressItems.length)}
                </div>
                <p className="text-sm text-slate-600">Average skill level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg secondary-text">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold primary-text">
                  {profileData.achievements?.length || 0}
                </div>
                <p className="text-sm text-slate-600">Unlocked rewards</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracking */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 secondary-text">Skills Progress</h2>

            {/* Group progress items by category */}
            {Object.entries(
              profileData.progressItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, ProgressItem[]>)
            ).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 secondary-text">
                  {formatProgressCategory(category)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base secondary-text">{formatSkillName(item.skill)}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-slate-100 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(item.level)}`}
                            style={{ width: `${(item.level / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Level {item.level}/5</span>
                          <span>{item.points} points</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4 secondary-text">Recent Activity</h2>
            {profileData.chatSessions?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Map through chat sessions here */}
                <p className="text-slate-600 col-span-2">No recorded chat sessions yet.</p>
              </div>
            ) : (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <p className="text-slate-600 mb-4">No chat activity yet. Start a conversation to begin tracking progress.</p>
                    <CreateChatSession profileId={profileData.id}>
                      <Button className="primary-bg text-white">Start First Chat</Button>
                    </CreateChatSession>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
