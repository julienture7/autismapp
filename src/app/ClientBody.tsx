"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    // Get the lexend variable class from the html element
    const lexendClass = document.documentElement.className;
    // Keep the lexend class and add antialiased
    document.body.className = `antialiased ${lexendClass}`;
  }, []);

  return <>{children}</>;
}
