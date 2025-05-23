import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="px-6 py-12 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold secondary-text mb-4">
              About <span className="primary-text">WonderChat</span>
            </h1>
            <p className="text-slate-700 max-w-3xl mx-auto">
              Learn more about our mission, technology, and the team behind WonderChat
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold secondary-text mb-6">Our Mission</h2>
              <p className="text-slate-700 mb-4">
                At WonderChat, we believe every child deserves the opportunity to develop strong communication skills in a safe, engaging, and personalized environment. Our mission is to harness the power of artificial intelligence to support children's unique developmental needs and learning styles.
              </p>
              <p className="text-slate-700 mb-4">
                We are committed to creating technology that adapts to each child's pace, interests, and abilities, fostering confidence, creativity, and critical thinking along the way.
              </p>
              <p className="text-slate-700">
                By combining cutting-edge AI with child development expertise, we aim to make learning social and communication skills an adventure that children look forward to every day.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/kids-with-tablets.jpg"
                alt="Children learning with technology"
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
          <h2 className="text-3xl font-bold secondary-text mb-8 text-center">Our Story</h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">How It All Started</h3>
              <p className="text-slate-700 mb-4">
                WonderChat began when our founder, a pediatric speech therapist, noticed how children with communication challenges responded positively to interactive digital experiences. Combining expertise in child development with advances in AI technology, the idea for an adaptive, child-friendly AI companion was born.
              </p>
              <p className="text-slate-700">
                Our team of educators, child psychologists, and AI engineers collaborated to create an experience that would provide meaningful support for children's communication skills while maintaining the element of fun and imagination that keeps children engaged.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">Our Approach</h3>
              <p className="text-slate-700 mb-4">
                Unlike generic chat applications, WonderChat is specifically designed with children's developmental needs in mind. Our AI adapts to each child's vocabulary level, interests, and communication patterns, providing just the right level of challenge and support.
              </p>
              <p className="text-slate-700">
                We believe in learning through play and conversation. Rather than rigid lessons, WonderChat engages children in natural, flowing interactions that build skills incrementally through stories, games, and friendly dialogue.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 secondary-text">Our Commitment to Safety</h3>
              <p className="text-slate-700 mb-4">
                Children's safety is our highest priority. WonderChat incorporates multiple layers of content filtering, age-appropriate boundaries, and privacy protections to create a secure environment where children can explore and learn.
              </p>
              <p className="text-slate-700">
                Parents have full visibility into their child's interactions and progress, with detailed reports and the ability to customize settings to align with family values and priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold secondary-text mb-12 text-center">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text">Dr. Emily Chen</h3>
              <p className="text-slate-500 mb-2">Founder & CEO</p>
              <p className="text-slate-700 text-sm">
                With a background in developmental psychology and AI research, Dr. Chen leads our vision to transform how children develop communication skills.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text">Marcus Johnson</h3>
              <p className="text-slate-500 mb-2">Chief Technology Officer</p>
              <p className="text-slate-700 text-sm">
                Marcus brings over 15 years of experience in natural language processing and conversational AI to make WonderChat intuitive and responsive.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold secondary-text">Dr. Sophia Rivera</h3>
              <p className="text-slate-500 mb-2">Head of Education</p>
              <p className="text-slate-700 text-sm">
                A former special education teacher, Dr. Rivera ensures that all WonderChat interactions are grounded in evidence-based educational practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 gradient-bg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold secondary-text mb-6">
            Join Us on This Journey
          </h2>
          <p className="text-slate-700 mb-8">
            We're just beginning to explore the possibilities of how AI can support children's development. By joining the WonderChat community, you'll be part of this exciting journey.
          </p>
          <Link href="/register">
            <Button size="lg" className="primary-bg text-white font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
