import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Workout App",
  description: "Workout App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body className="h-screen flex flex-col bg-[#030303]">
        <ClerkProvider>
          <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-white font-bold text-lg tracking-tight">💪 WorkoutApp</span>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <div className="flex items-center gap-3">
                  <SignInButton>
                    <Button variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-white">Sign In</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button>Sign Up</Button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
