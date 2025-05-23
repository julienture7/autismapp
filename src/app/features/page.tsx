import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <MainLayout>
      <section className="px-6 py-12 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold secondary-text mb-4">
              <span className="primary-text">WonderChat</span> Features
            </h1>
            <p className="text-slate-700 max-w-3xl mx-auto">
              Discover how our innovative AI platform helps children develop essential communication and social skills
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16">
            {/* Feature 1: Adaptive AI Conversations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold secondary-text mb-4">Adaptive AI Conversations</h2>
                <p className="text-slate-700 mb-4">
                  WonderChat's AI engine dynamically adjusts to your child's communication level, interests, and needs. As your child interacts with WonderChat, the system learns their preferences and adapts conversations to their unique profile.
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                  <li>Vocabulary matching to your child's developmental level</li>
                  <li>Topic selection based on your child's interests</li>
                  <li>Pace adjustment for comfortable communication flow</li>
                  <li>Progressive complexity as skills improve</li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <div className="bg-gray-100 p-10 flex items-center justify-center">
                  <div className="w-16 h-16 primary-text">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 7.58l-4-4-4 4-1.406-1.406 5.406-5.406 5.406 5.406zM12 12.584l-8-8-4 4 12 12 12-12-4-4z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Interactive Learning Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-100 p-10 flex items-center justify-center">
                  <div className="w-16 h-16 primary-text">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 3h-18c-1.657 0-3 1.343-3 3v12c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3v-12c0-1.657-1.343-3-3-3zM3.5 7.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM7 12c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM11.5 16.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM17.5 11c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold secondary-text mb-4">Interactive Learning Activities</h2>
                <p className="text-slate-700 mb-4">
                  Learning communication skills isn't just about talking—it's about engaging in meaningful activities that make learning fun. WonderChat offers a variety of interactive experiences designed to build skills naturally.
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                  <li>Storytelling with branching narratives</li>
                  <li>Role-playing scenarios for social skill practice</li>
                  <li>Word games that build vocabulary and reading skills</li>
                  <li>Question-and-answer challenges that promote critical thinking</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Progress Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold secondary-text mb-4">Comprehensive Progress Tracking</h2>
                <p className="text-slate-700 mb-4">
                  Parents and caregivers gain valuable insights into their child's development through WonderChat's detailed progress tracking system. Watch skills grow over time with easy-to-understand visualizations and reports.
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                  <li>Visual dashboards showing skill development</li>
                  <li>Milestone achievements and celebrations</li>
                  <li>Session summaries with key learning moments</li>
                  <li>Personalized recommendations for continued growth</li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <div className="bg-gray-100 p-10 flex items-center justify-center">
                  <div className="w-16 h-16 primary-text">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 6l-9.5 9.5-5-5L0 19l1 1 8.5-8.5 5 5 9.5-9.5 1-1z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Parent Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-100 p-10 flex items-center justify-center">
                  <div className="w-16 h-16 primary-text">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1l-12 12h3v10h18v-10h3l-12-12zM12 21.25c-1.242 0-2.25-1.008-2.25-2.25s1.008-2.25 2.25-2.25 2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25zM14.5 14h-5v-5h5v5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold secondary-text mb-4">Comprehensive Parent Controls</h2>
                <p className="text-slate-700 mb-4">
                  We understand that every family has unique values and preferences. WonderChat gives parents complete control over their child's experience, with robust settings and monitoring capabilities.
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                  <li>Content filtering with adjustable sensitivity levels</li>
                  <li>Session time limits and scheduling</li>
                  <li>Topic preferences and exclusions</li>
                  <li>Conversation history review</li>
                  <li>Learning goal customization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 soft-bg">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold secondary-text mb-8 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Builds Confidence</h3>
              <p className="text-slate-700">
                Practice conversation in a judgment-free environment where mistakes are learning opportunities, helping children gain confidence in their communication abilities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.582 1.469c-1.046-1.481-5.012-1.283-9.779 0.677-0.069 0.039-0.136 0.080-0.205 0.117-0.066-0.037-0.131-0.074-0.197-0.113-4.763-1.962-8.728-2.166-9.778-0.684-1.241 1.76-0.090 6.514 2.69 11.837 0.034 0.064 0.069 0.127 0.108 0.192-0.039 0.064-0.074 0.128-0.108 0.192-2.927 5.322-4.107 10.060-2.866 11.82 1.054 1.483 5.020 1.28 9.779-0.678 0.137-0.057 0.276-0.115 0.416-0.174 0.135 0.061 0.268 0.118 0.406 0.175 2.754 1.139 5.066 1.555 6.622 1.555 1.065 0 1.876-0.225 2.244-0.736 1.245-1.76 0.103-6.526-2.657-11.852-0.040-0.076-0.080-0.152-0.124-0.228 0.041-0.074 0.082-0.148 0.122-0.224 2.717-5.325 3.847-10.088 2.614-11.844zM12.797 10.11c0.387 0.381 0.717 0.775 1.021 1.179 0.301 0.4 0.568 0.807 0.811 1.211-0.247 0.404-0.51 0.815-0.811 1.211-0.305 0.404-0.635 0.798-1.021 1.179-0.386-0.381-0.716-0.775-1.021-1.179-0.301-0.396-0.568-0.807-0.811-1.211 0.247-0.404 0.51-0.811 0.811-1.211 0.305-0.404 0.635-0.798 1.021-1.179zM2.010 5.344c0.208-0.293 2.29-0.275 5.971 1.375-0.635 0.545-1.259 1.141-1.855 1.798-0.422 0.463-0.815 0.934-1.196 1.404-1.814-2.641-3.115-5.053-2.92-4.577zM7.981 18.687c-3.681 1.651-5.764 1.67-5.971 1.375-0.201-0.492 1.139-2.936 2.985-5.614 0.378 0.47 0.773 0.942 1.193 1.404 0.594 0.653 1.22 1.249 1.793 1.782v1.053zM12.797 17.270c-0.836 0.856-1.677 1.635-2.501 2.324-0.820-0.686-1.661-1.461-2.497-2.324-0.844-0.856-1.598-1.735-2.280-2.614 0.686-0.879 1.438-1.757 2.282-2.613 0.832-0.856 1.673-1.635 2.495-2.324 0.824 0.686 1.665 1.468 2.501 2.324 0.845 0.856 1.598 1.735 2.280 2.613-0.682 0.879-1.436 1.758-2.28 2.614zM21.991 20.061c-0.208 0.293-2.29 0.275-5.971-1.375 0.523-0.392 1.049-0.834 1.574-1.322 0.53-0.488 1.020-0.983 1.478-1.47v-1.53c-0.458-0.487-0.947-0.981-1.477-1.469-0.525-0.488-1.051-0.93-1.575-1.322 3.693-1.639 5.771-1.658 5.979-1.375 0.147 0.296-0.352 1.885-1.602 4.030-0.441 0.752-0.971 1.538-1.559 2.321-0.422 0.568-0.863 1.132-1.325 1.684 0.462 0.553 0.903 1.116 1.325 1.685 0.588 0.783 1.118 1.568 1.559 2.322 1.25 2.146 1.75 3.735 1.594 4.021z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Enhances Social Skills</h3>
              <p className="text-slate-700">
                Through guided conversations and role-playing, children learn important social cues, turn-taking, empathy, and appropriate responses to various situations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 8.5c0 0.827-0.673 1.5-1.5 1.5s-1.5-0.673-1.5-1.5c0-0.827 0.673-1.5 1.5-1.5s1.5 0.673 1.5 1.5zM14 16.24c0 0.713-0.495 1.24-1 1.24s-1-0.527-1-1.24c0-0.713 0.495-1.24 1-1.24s1 0.527 1 1.24zM11 12c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1zM17 8c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1zM19 13c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1zM16 16c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1zM18.5 22h-13c-0.827 0-1.5-0.673-1.5-1.5 0-0.387 0.149-0.745 0.41-1.013 2.097-2.142 2.59-3.502 2.59-4.487 0-1.305-0.669-1.971-1.296-2.989-0.681-1.102-1.464-2.359-1.464-4.511 0-4.136 3.364-7.5 7.5-7.5s7.5 3.364 7.5 7.5c0 2.152-0.783 3.409-1.464 4.511-0.627 1.018-1.296 1.684-1.296 2.989 0 0.985 0.493 2.345 2.59 4.487 0.263 0.268 0.41 0.626 0.41 1.013 0.002 0.827-0.671 1.5-1.498 1.5zM12 2c-3.584 0-6.5 2.916-6.5 6.5 0 1.849 0.673 2.931 1.303 3.928 0.699 1.13 1.457 2.346 1.457 4.072 0 1.326-0.628 2.945-2.819 5.229-0.094 0.096-0.14 0.195-0.141 0.271 0 0.275 0.224 0.5 0.5 0.5h13c0.276 0 0.5-0.225 0.5-0.5 0-0.076-0.047-0.175-0.141-0.271-2.191-2.284-2.819-3.903-2.819-5.229 0-1.726 0.757-2.941 1.457-4.072 0.63-0.997 1.303-2.079 1.303-3.928 0-3.584-2.916-6.5-6.5-6.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Expands Creativity</h3>
              <p className="text-slate-700">
                Open-ended conversations and storytelling activities stimulate imagination and creative thinking, helping children express themselves more fully.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 2h-12c-0.553 0-1 0.447-1 1v18c0 0.553 0.447 1 1 1h14c0.553 0 1-0.447 1-1v-16l-4-3zM16 20h-12v-16h11l1 1v15zM12 18h-7v-1h7v1zM12 16h-7v-1h7v1zM12 14h-7v-1h7v1zM12 12h-7v-1h7v1zM12 10h-7v-1h7v1zM12 8h-7v-1h7v1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Builds Vocabulary</h3>
              <p className="text-slate-700">
                Through natural conversation and targeted activities, children expand their vocabulary and learn to express themselves more precisely.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 11.016v8.016q0 0.422-0.305 0.703t-0.727 0.281-0.727-0.281-0.305-0.703v-8.016q0-0.422 0.305-0.703t0.727-0.281 0.727 0.281 0.305 0.703zM12.984 18.984v-1.969q0-0.422 0.281-0.703t0.703-0.281 0.703 0.281 0.281 0.703v1.969q0 0.422-0.281 0.703t-0.703 0.281-0.703-0.281-0.281-0.703zM15.984 15.984v-1.969q0-0.422 0.281-0.703t0.703-0.281 0.703 0.281 0.281 0.703v1.969q0 0.422-0.281 0.703t-0.703 0.281-0.703-0.281-0.281-0.703zM9 18.984v-1.969q0-0.422 0.281-0.703t0.703-0.281 0.703 0.281 0.281 0.703v1.969q0 0.422-0.281 0.703t-0.703 0.281-0.703-0.281-0.281-0.703zM6 15.984v-1.969q0-0.422 0.281-0.703t0.703-0.281 0.703 0.281 0.281 0.703v1.969q0 0.422-0.281 0.703t-0.703 0.281-0.703-0.281-0.281-0.703zM12 2.016q4.125 0 7.055 2.906t2.93 7.078q0 2.766-1.313 4.969t-3.797 3.422v-1.172q1.734-1.078 2.766-2.883t1.031-4.336q0-3.328-2.367-5.672t-5.672-2.344-5.672 2.344-2.367 5.672q0 2.531 1.031 4.336t2.766 2.883v1.172q-2.484-1.219-3.797-3.422t-1.313-4.969q0-4.172 2.93-7.078t7.055-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Develops Critical Thinking</h3>
              <p className="text-slate-700">
                Through questions, puzzles, and problem-solving scenarios, children develop reasoning skills and learn to think more critically about the world around them.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.913 11.581h-1.456c-0.771-5.391-4.652-9.26-10.043-10.015v-1.566h-0.827v1.566c-5.391 0.771-9.271 4.641-10.027 10.015h-1.56v0.827h1.566c0.755 5.375 4.641 9.26 10.032 10.016v1.566h0.827v-1.566c5.391-0.771 9.271-4.641 10.027-10.016h1.461v-0.827zM12.087 21.598c-4.86-0.733-8.594-4.619-9.054-9.19h1.848v-0.827h-1.849c0.444-4.887 4.224-8.532 9.055-9.177v1.573h0.827v-1.573c4.831 0.645 8.611 4.29 9.054 9.177h-1.848v0.827h1.849c-0.46 4.572-4.195 8.457-9.055 9.19v-1.581h-0.827v1.581z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-2">Supports Independence</h3>
              <p className="text-slate-700">
                With a responsive AI companion available whenever needed, children can practice communication skills independently, building self-reliance and autonomy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold secondary-text mb-6">
            Ready to Transform Your Child's Learning Journey?
          </h2>
          <p className="text-slate-700 mb-8">
            Join thousands of families who are seeing remarkable progress in their children's communication and social skills with WonderChat.
          </p>
          <Link href="/register">
            <Button size="lg" className="primary-bg text-white font-semibold">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
