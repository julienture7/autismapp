"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProgressSystemPage() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <MainLayout>
      <div className="px-6 py-12 md:px-20 lg:px-40 gradient-bg min-h-[calc(100vh-180px)]">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 secondary-text">
              <span className="primary-text">WonderChat</span> Progress Tracking System
            </h1>
            <p className="text-slate-700 text-lg max-w-3xl mx-auto">
              Our comprehensive progress tracking system helps parents monitor their child's development in key skill areas while they enjoy conversations with WonderChat.
            </p>
          </div>

          {/* Skills Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 secondary-text text-center">
              Skill Categories We Track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="primary-text mb-4">
                    <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M160,128c0,8.84-14.33,16-32,16s-32-7.16-32-16,14.33-16,32-16S160,119.16,160,128Zm54.83-98.83a8,8,0,0,0-9.95-1.27l-47.16,31.44A64,64,0,0,0,96,32H80A56.06,56.06,0,0,0,24,88v80a56.06,56.06,0,0,0,56,56H96a64,64,0,0,0,61.72-27.34l47.16,31.44a8,8,0,0,0,4.12,1.14,8,8,0,0,0,5.83-2.41A8,8,0,0,0,218,216V40A8,8,0,0,0,214.83,29.17ZM94.91,178.91A40,40,0,0,1,64,192,40,40,0,0,1,64,64a40,40,0,0,1,30.91,13.09,40,40,0,0,1,0,101.82Zm107.09,13.6-52-34.66c0-.95-.05-1.88-.05-2.85s0-1.9.05-2.85l52-34.66Z"></path>
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Communication Skills</CardTitle>
                  <CardDescription>
                    Developing effective verbal expression and comprehension
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Active Listening:</strong> Attentively focusing on what others say</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Clear Expression:</strong> Articulating thoughts and ideas clearly</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Question Asking:</strong> Forming relevant and thoughtful questions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="primary-text mb-4">
                    <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M176.21,171.18a64.1,64.1,0,0,1-96.42,0A71.74,71.74,0,0,0,40,232a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8A71.74,71.74,0,0,0,176.21,171.18ZM72,96a56,56,0,1,0,56-56A56.06,56.06,0,0,0,72,96Z"></path>
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Social Skills</CardTitle>
                  <CardDescription>
                    Building positive relationships and social awareness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Empathy:</strong> Recognizing and understanding others' feelings</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Turn Taking:</strong> Participating appropriately in conversations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Cooperation:</strong> Working together effectively with others</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="primary-text mb-4">
                    <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-36a12,12,0,1,1-12-12A12,12,0,0,1,176,180Zm-84,0a12,12,0,1,1-12-12A12,12,0,0,1,92,180Zm90.33-93.88a65.46,65.46,0,0,1,14.8,34.3,8,8,0,0,1-6.86,9A7.9,7.9,0,0,1,189.17,135a49.32,49.32,0,0,0-11.21-26A49.81,49.81,0,0,0,128,90,48,48,0,0,0,80,138a8,8,0,0,1-16,0,64,64,0,0,1,118.33-34.88Z"></path>
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Problem-Solving Skills</CardTitle>
                  <CardDescription>
                    Developing analytical thinking and creative solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Critical Thinking:</strong> Analyzing information to solve problems</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Creativity:</strong> Finding novel and innovative solutions</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span><strong>Persistence:</strong> Continuing effort despite challenges</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How Tracking Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 secondary-text text-center">
              How Our Progress Tracking Works
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 secondary-text">During Chat Sessions</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">1</span>
                        <div>
                          <p className="font-medium text-slate-800">AI Analysis</p>
                          <p className="text-slate-600">WonderChat analyzes your child's communication patterns, vocabulary usage, and interaction style.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">2</span>
                        <div>
                          <p className="font-medium text-slate-800">Skill Detection</p>
                          <p className="text-slate-600">Our system identifies which skills your child is demonstrating or practicing.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">3</span>
                        <div>
                          <p className="font-medium text-slate-800">Progress Recording</p>
                          <p className="text-slate-600">Points are awarded for skill use, with more points for advanced applications.</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 secondary-text">Progress Visualization</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">4</span>
                        <div>
                          <p className="font-medium text-slate-800">Skill Levels</p>
                          <p className="text-slate-600">Each skill progresses through 5 levels, with increasing sophistication required at each level.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">5</span>
                        <div>
                          <p className="font-medium text-slate-800">Achievement System</p>
                          <p className="text-slate-600">Children earn achievements when reaching new skill levels, providing recognition and motivation.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="primary-bg text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-2">6</span>
                        <div>
                          <p className="font-medium text-slate-800">Parent Insights</p>
                          <p className="text-slate-600">Parents can view detailed reports and progress over time through the dashboard.</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 secondary-text text-center">
              Benefits of Progress Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">For Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Gain insights into your child's developmental journey</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Identify areas where additional support may be beneficial</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Track progress over time with detailed visualizations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Receive personalized suggestions for supporting skill development</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">For Children</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Receive recognition and positive reinforcement through achievements</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Experience personalized conversations that adapt to their skill levels</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Build confidence as they see their own progress over time</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-xl primary-text">•</span>
                      <span>Learn in a way that feels like play rather than formal instruction</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" className="primary-bg text-white">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
