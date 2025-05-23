import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Providers from "./providers";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "WonderChat - Magical AI for Unique Young Minds",
  description: "WonderChat is a revolutionary AI voice chat agent designed to help children develop communication and social skills in a fun, engaging, and safe environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.variable}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          <Providers>{children}</Providers>
        </ClientBody>
      </body>
    </html>
  );
}
