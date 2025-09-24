import "@/styles/globals.css";
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; 
import { Analytics } from "@vercel/analytics/next";

import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./providers"; 
import { ThemeProvider } from "@/app/_components/theme-provider"; 
import { GlassFooter } from "@/app/_components/layout/glass-footer";
import { Toaster } from "sonner";

//  descriptive metadata 
export const metadata: Metadata = {
  title: "AuraPark - Smart Parking Solution",
  description: "Modern parking management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable}`}>
        {/*
          The providers are nested to give the entire app access to
          tRPC, Authentication state, and Theme state.
        */}
        <TRPCReactProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {/* This div creates the sticky footer layout */}
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <GlassFooter />
              </div>
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </Providers>
        </TRPCReactProvider>
        
        <Analytics />
      </body>
    </html>
  );
}