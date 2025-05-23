import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <MainLayout>
      <section className="px-6 py-16 md:px-20 lg:px-40 gradient-bg">
        <div className="layout-content-container mx-auto flex max-w-7xl flex-col">
          <div className="@container">
            <div className="flex flex-col items-center gap-10 px-4 py-10 @[480px]:gap-12 @[960px]:flex-row @[960px]:gap-16">
              <div className="w-full @[960px]:w-[55%] @[960px]:order-2">
                <div className="aspect-[16/9] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105">
                  <Image
                    alt="Children using tablet with WonderChat AI"
                    className="h-full w-full object-cover object-center"
                    src="/images/wonderchat-hero.jpg"
                    width={720}
                    height={405}
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 text-center @[960px]:w-[45%] @[960px]:text-left @[960px]:order-1">
                <h1 className="secondary-text text-4xl font-extrabold leading-tight tracking-tight @[480px]:text-5xl lg:text-6xl">
                  Meet <span className="primary-text">WonderChat</span>: Your Child's Magical Friend
                </h1>
                <p className="text-slate-700 text-base font-normal leading-relaxed @[480px]:text-lg">
                  WonderChat is a revolutionary AI voice chat agent designed to help children develop communication and social skills in a fun, engaging, and safe environment. Our magical AI companion adapts to each child's unique needs, fostering confidence and growth.
                </p>
                <Link href="/login" className="mt-4 self-center @[960px]:self-start">
                  <Button size="lg" className="primary-bg text-white text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    Start the Adventure
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 soft-bg">
        <div className="layout-content-container mx-auto flex max-w-6xl flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="secondary-text text-3xl font-bold leading-tight tracking-tight @[480px]:text-4xl">
              Why <span className="primary-text">WonderChat</span> is Special
            </h2>
            <p className="text-slate-600 text-base font-normal leading-relaxed max-w-3xl mx-auto @[480px]:text-lg">
              WonderChat offers a unique approach to supporting children, combining the power of AI with a playful, imaginative world.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-sky-300">
              <div className="primary-text">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M236,48.23a14,14,0,0,0-19.8,0L192,72.48l-24.26-24.25a14,14,0,0,0-19.8,0L124,72.48,99.71,48.23a14,14,0,0,0-19.8,19.8L104.17,92.28,20,176.43a14,14,0,0,0,19.8,19.8L124,112l24.26,24.25a14,14,0,0,0,19.8,0L192,112l24.26,24.25a14,14,0,0,0,19.8-19.8L211.83,92.28,236,72.48A14,14,0,0,0,236,48.23ZM116,104,36.69,183.31,72.69,219.31,152,140Zm48,8L188.26,87.71,208,68l-19.71-19.71ZM48,68,67.71,48.23,88,68.51,68.23,88.28Zm152,88L180.26,176,160,155.71l19.74-19.74ZM88,32a8,8,0,0,1,8-8H112V8a8,8,0,0,1,16,0V24h16a8,8,0,0,1,0,16H128V56a8,8,0,0,1-16,0V40H96A8,8,0,0,1,88,32Zm104,176a16,16,0,1,1,16-16A16,16,0,0,1,192,208Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="secondary-text text-xl font-semibold leading-tight">Personalized Learning</h3>
                <p className="text-slate-600 text-sm font-normal leading-normal">
                  Our AI adapts to each child's individual communication style and learning pace, providing tailored interactions and activities.
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-sky-300">
              <div className="primary-text">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="secondary-text text-xl font-semibold leading-tight">Engaging and Fun</h3>
                <p className="text-slate-600 text-sm font-normal leading-normal">
                  WonderChat transforms learning into an adventure with interactive stories, games, and a friendly AI companion that keeps children motivated.
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-sky-300">
              <div className="primary-text">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM112.34,158.34a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L104,141.37l36.34-36.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="secondary-text text-xl font-semibold leading-tight">Safe and Supportive</h3>
                <p className="text-slate-600 text-sm font-normal leading-normal">
                  We prioritize safety with strict privacy measures and content moderation, ensuring a secure environment for children to explore and learn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-20 lg:px-40 gradient-bg">
        <div className="@container mx-auto max-w-3xl">
          <div className="flex flex-col items-center justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-16">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="secondary-text text-3xl font-bold leading-tight tracking-tight @[480px]:text-4xl">
                Join the <span className="primary-text">WonderChat</span> Community
              </h2>
              <p className="text-slate-700 text-base font-normal leading-relaxed @[480px]:text-lg">
                Start your child's journey to improved communication and social skills today.
              </p>
            </div>
            <Link href="/login">
              <Button size="lg" className="primary-bg text-white text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
