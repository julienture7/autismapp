"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const WonderChatLogo = () => (
  <div className="size-7 primary-text">
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
);

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
      <div className="flex items-center gap-3 text-slate-900">
        <WonderChatLogo />
        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-[-0.015em]">
          WonderChat
        </h2>
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        <Link
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive("/") ? "primary-text" : "text-slate-700 hover:primary-text"
          }`}
          href="/"
        >
          Home
        </Link>
        <Link
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive("/about") ? "primary-text" : "text-slate-700 hover:primary-text"
          }`}
          href="/about"
        >
          About
        </Link>
        <Link
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive("/features") ? "primary-text" : "text-slate-700 hover:primary-text"
          }`}
          href="/features"
        >
          Features
        </Link>
        <Link
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive("/for-parents") ? "primary-text" : "text-slate-700 hover:primary-text"
          }`}
          href="/for-parents"
        >
          For Parents
        </Link>
        <Link
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive("/contact") ? "primary-text" : "text-slate-700 hover:primary-text"
          }`}
          href="/contact"
        >
          Contact
        </Link>
      </nav>
      <div>
        {status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-700 hover:primary-text">
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="primary-bg text-white hover:bg-primary/90"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="primary-bg text-white hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
