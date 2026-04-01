import type { Metadata } from "next";
import { Space_Grotesk, Inter, Beau_Rivage } from "next/font/google";
import { ToastProvider } from "@/components/shared/Toast";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { DottedSurfaceWrapper } from "@/components/shared/DottedSurfaceWrapper";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const beauRivage = Beau_Rivage({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HackQuest — Gamified Hackathon Platform",
  description:
    "The ultimate gamified hackathon platform. Earn XP, collect NFTs, compete on the global leaderboard, and trade in the auction house.",
  keywords: ["hackathon", "gamification", "NFT", "XP", "leaderboard", "blockchain", "algorand"],
  openGraph: {
    title: "HackQuest — Gamified Hackathon Platform",
    description:
      "Earn XP, collect NFTs, compete globally. The esports-grade hackathon experience.",
    type: "website",
  },
};

import { UnifiedNavbar } from "@/components/layout/UnifiedNavbar";
import { LoadingProvider } from "@/components/shared/LoadingProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${beauRivage.variable} font-heading antialiased bg-black text-white selection:bg-[#9D50FF]/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingProvider>
            <ToastProvider>
              {/* Global dotted-surface background */}
              <DottedSurfaceWrapper />
              <UnifiedNavbar />
              {children}
            </ToastProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
