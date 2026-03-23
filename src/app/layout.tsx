import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ToastProvider } from "@/components/shared/Toast";
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

export const metadata: Metadata = {
  title: "HackQuest — Gamified Hackathon Platform",
  description:
    "The ultimate gamified hackathon platform. Earn XP, collect NFTs, compete on the global leaderboard, and trade in the auction house.",
  keywords: ["hackathon", "gamification", "NFT", "XP", "leaderboard", "blockchain", "solana", "algorand"],
  openGraph: {
    title: "HackQuest — Gamified Hackathon Platform",
    description:
      "Earn XP, collect NFTs, compete globally. The esports-grade hackathon experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body antialiased bg-hq-bg-primary text-hq-text-primary`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

