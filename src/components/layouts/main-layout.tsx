"use client";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
