import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

// Initialize the Oxanium font
const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["200", "400"],
  variable: "--font-oxanium",
});

// Metadata (replaces Head from _app.js)
export const metadata: Metadata = {
  title: {
    template: "%s | Brandon Gottshall",
    default: "Brandon Gottshall",
  },
  description: "Software Engineer & Web Developer",
};

// Root layout (combines _app.js and Layout.js)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={oxanium.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-cream text-navy dark:bg-black dark:text-tan transition-colors duration-300">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
