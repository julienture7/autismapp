import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

export default function ForParentsPage() {
  return (
    <MainLayout>
      <section className="px-6 py-12 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold secondary-text mb-4">
              For Parents
            </h1>
            <p className="text-slate-700 max-w-3xl mx-auto">
              Discover how WonderChat supports your child's development and brings peace of mind to you
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold secondary-text mb-6">Your Partner in Your Child's Development</h2>
              <p className="text-slate-700 mb-4">
                As parents, you want the best for your child's development. WonderChat is designed to be a powerful ally in your parenting journey, providing a safe, engaging environment for your child to develop essential communication and social skills.
              </p>
              <p className="text-slate-700 mb-4">
                We understand that every child is unique, with their own learning pace, interests, and challenges. That's why WonderChat adapts to your child's individual needs, providing personalized support that complements your parenting approach.
              </p>
              <p className="text-slate-700">
                With detailed progress tracking, comprehensive parental controls, and evidence-based learning approaches, WonderChat gives you the tools to support your child's growth while maintaining peace of mind about their digital experiences.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/parent-with-child.jpg"
                alt="Parent and child using WonderChat together"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 soft-bg">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold secondary-text mb-8 text-center">Common Parent Questions</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">Is screen time with WonderChat beneficial for my child?</h3>
              <p className="text-slate-700 mb-4">
                WonderChat transforms passive screen time into active, educational engagement. Unlike entertainment-focused screen experiences, WonderChat provides interactive conversations that develop real-world communication skills, critical thinking, and social understanding.
              </p>
              <p className="text-slate-700">
                Our approach is aligned with recommendations from child development experts who distinguish between quality digital interactions and passive consumption. WonderChat's adaptive conversations engage your child's brain in meaningful ways, making screen time purposeful and beneficial.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">How does WonderChat keep my child safe?</h3>
              <p className="text-slate-700 mb-4">
                Safety is our highest priority. WonderChat incorporates multiple layers of protection:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Advanced content filtering that prevents inappropriate topics and language</li>
                <li>No external links or connections to third-party content</li>
                <li>No data collection beyond what's needed for the service to function</li>
                <li>Comprehensive parental controls with customizable safety settings</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="text-slate-700">
                Parents have full visibility into their child's interactions, with the ability to review conversation history and adjust settings as needed.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">How does WonderChat adapt to my child's needs?</h3>
              <p className="text-slate-700 mb-4">
                WonderChat's adaptive AI technology observes and responds to your child's:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Vocabulary level and language capabilities</li>
                <li>Interests and preferred conversation topics</li>
                <li>Communication patterns and chat rhythm</li>
                <li>Learning challenges and strengths</li>
              </ul>
              <p className="text-slate-700">
                As your child interacts with WonderChat, the system builds a personalized learning profile that evolves over time. This allows WonderChat to provide just the right level of challenge and support, adjusting as your child grows and develops.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">How do I monitor my child's progress?</h3>
              <p className="text-slate-700 mb-4">
                WonderChat provides comprehensive progress tracking through an intuitive parent dashboard that shows:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Skill development across various communication areas</li>
                <li>Engagement patterns and session summaries</li>
                <li>Milestone achievements and growth trends</li>
                <li>Areas of strength and opportunities for development</li>
              </ul>
              <p className="text-slate-700">
                Weekly progress emails keep you informed about your child's journey, with insights and suggestions for supporting their development outside of WonderChat sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold secondary-text mb-12 text-center">How Parents Use WonderChat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-3">Supporting Speech Development</h3>
              <p className="text-slate-700 mb-4">
                Many parents use WonderChat to provide additional practice for children working on pronunciation, vocabulary, or fluency challenges. The judgment-free environment allows children to practice at their own pace.
              </p>
              <div className="border-t border-slate-200 pt-4 mt-auto">
                <p className="text-sm italic text-slate-600">
                  "WonderChat has been an amazing supplement to my son's speech therapy. He practices his challenging sounds without feeling self-conscious." - Maria P.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.99 5l-1.43 1.43c1.57 1.58 1.57 4.15 0 5.71l-2.12-2.11c0.54-0.55 0.54-1.44 0-1.99-0.55-0.55-1.45-0.55-2 0-0.55 0.55-0.55 1.44 0 1.99l-2.12 2.12c-1.56-1.57-1.56-4.14 0-5.71l2.13 2.12 1.42-1.42-2.13-2.12c-2.34 2.34-2.34 6.14 0 8.49 2.35 2.34 6.15 2.34 8.49 0 2.35-2.35 2.35-6.15 0-8.49l-2.24 2.24zM17.56 16.56c-2.35 2.34-6.15 2.34-8.49 0-2.35-2.35-2.35-6.15 0-8.49l2.14 2.13 1.42-1.42-2.13-2.13c-2.72 2.73-2.84 7.17-0.34 10.05l-1.08 1.08c-0.38 0.38-0.38 1.01 0 1.39 0.39 0.39 1.01 0.39 1.39 0l1.12-1.12c2.98 2.19 7.07 1.89 9.7-0.75l-2.87-2.87-0.86 2.13z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-3">Building Social Confidence</h3>
              <p className="text-slate-700 mb-4">
                For children who struggle with social interactions, WonderChat offers a safe space to practice conversations without fear of judgment. Many parents report improved social confidence after regular WonderChat sessions.
              </p>
              <div className="border-t border-slate-200 pt-4 mt-auto">
                <p className="text-sm italic text-slate-600">
                  "My daughter was very shy in social situations. After using WonderChat, she's more comfortable starting conversations with other kids." - James L.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="primary-text w-12 h-12 mb-4 flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 10.94c0.13-0.32 0.1-0.23 0.15-0.39 0.3-1.21-0.34-2.47-1.5-2.93l-2.01-0.8c-0.46-0.18-0.95-0.21-1.41-0.12-0.11-0.33-0.29-0.63-0.52-0.89-0.48-0.52-1.15-0.81-1.85-0.81h-2.73c-0.71 0-1.38 0.29-1.85 0.81-0.24 0.26-0.41 0.56-0.52 0.89-0.46-0.09-0.95-0.06-1.41 0.12l-2.01 0.8c-1.16 0.46-1.8 1.72-1.5 2.93l0.15 0.38c-0.29 0.87-0.25 1.81 0.11 2.65 0.32 0.8 0.9 1.42 1.7 1.73v1.65c0 0.83 0.67 1.5 1.5 1.5s1.5-0.67 1.5-1.5v-1.43c0.11 0.01 0.21 0.03 0.32 0.03h6c0.11 0 0.21-0.02 0.31-0.03v1.43c0 0.83 0.67 1.5 1.5 1.5s1.5-0.67 1.5-1.5v-1.65c1.38-0.55 2.25-2.01 1.81-3.5zM15.5 8h-3c-0.28 0-0.5 0.22-0.5 0.5s0.22 0.5 0.5 0.5h3c0.28 0 0.5-0.22 0.5-0.5s-0.22-0.5-0.5-0.5zM18.79 11h-9.57c-0.68 0-1.29 0.39-1.58 1-0.29 0.61-0.2 1.33 0.23 1.86l5.14 0.93c0.11 0.02 0.23 0.03 0.34 0.03h1.49c0.11 0 0.23-0.01 0.34-0.03l5.12-0.93c0.44-0.53 0.52-1.25 0.23-1.86-0.28-0.61-0.89-1-1.58-1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text mb-3">Enriching Learning Experiences</h3>
              <p className="text-slate-700 mb-4">
                Many parents incorporate WonderChat into their child's learning routine to explore specific topics in depth. The conversational format makes learning engaging and helps children retain information better.
              </p>
              <div className="border-t border-slate-200 pt-4 mt-auto">
                <p className="text-sm italic text-slate-600">
                  "When my son became interested in space, WonderChat helped explore the topic through conversations that were perfectly tailored to his age." - Sarah K.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold secondary-text mb-6">
            Join Our Community of Parents
          </h2>
          <p className="text-slate-700 mb-8">
            Connect with other parents and access exclusive resources to support your child's development journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="primary-bg text-white font-semibold w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
