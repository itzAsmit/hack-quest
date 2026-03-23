// HackQuest Constants

export const SITE_NAME = "HackQuest";
export const SITE_DESCRIPTION = "The Gamified Hackathon Platform — Earn XP, Collect NFTs, Compete Globally.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// XP & Leveling
export const XP_PER_LEVEL = 1000;
export const MAX_LEVEL = 100;

// Currency
export const HACKS_DECIMALS = 0; // Hacks are whole numbers

// NFT Rarity
export const RARITY_COLORS = {
  common: { color: "#94A3B8", label: "Common" },
  rare: { color: "#3B82F6", label: "Rare" },
  epic: { color: "#A855F7", label: "Epic" },
  legendary: { color: "#F59E0B", label: "Legendary" },
  mythic: { color: "#EF4444", label: "Mythic" },
} as const;

export const PACK_SIZE = 3; // 3 NFTs of the same rarity = 1 pack

// Navigation
export const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Showplace", href: "/showplace" },
  { label: "Auction", href: "/auction" },
  { label: "Leaderboard", href: "/leaderboard" },
] as const;

export const DASHBOARD_LINKS = [
  { label: "Overview", href: "/dashboard/overview", icon: "LayoutDashboard" },
  { label: "My NFTs", href: "/dashboard/nfts", icon: "Image" },
  { label: "Friends", href: "/dashboard/friends", icon: "Users" },
  { label: "Wallet", href: "/dashboard/wallet", icon: "Wallet" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const ORGANISER_LINKS = [
  { label: "Overview", href: "/organiser", icon: "LayoutDashboard" },
  { label: "Events", href: "/organiser/events", icon: "Calendar" },
  { label: "Quests", href: "/organiser/quests", icon: "Target" },
  { label: "NFTs", href: "/organiser/nfts", icon: "Image" },
  { label: "Players", href: "/organiser/players", icon: "Users" },
  { label: "Teams", href: "/organiser/teams", icon: "Shield" },
  { label: "Activity", href: "/organiser/activity", icon: "Activity" },
] as const;
