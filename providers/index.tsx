"use client";

import ConvexClientProvider from "./convex-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </ClerkProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
