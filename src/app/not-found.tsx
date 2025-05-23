import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center px-6 py-16 md:px-20 lg:px-40 gradient-bg min-h-[calc(100vh-180px)]">
        <div className="text-center max-w-xl">
          <h1 className="text-6xl font-bold mb-6 primary-text">404</h1>
          <h2 className="text-3xl font-bold mb-4 secondary-text">Page Not Found</h2>
          <p className="text-lg mb-8 text-slate-700">
            Oops! It seems like the page you're looking for has gone on a
            magical adventure of its own.
          </p>
          <Link href="/">
            <Button size="lg" className="primary-bg text-white">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
