"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Event {
  id: string;
  name: string;
  description: string | null;
  banner_image: string | null;
  status: string;
  start_date: string;
  end_date: string;
  tags: string[];
  max_participants: number | null;
  prize_info: string | null;
}

const QUEST_TYPES = [
  { label: "Hackathons", key: "hackathon" },
  { label: "Mini Games", key: "mini_game" },
  { label: "Team Missions", key: "team_mission" },
];

const REWARD_TYPES = [
  { label: "HACKS Token", key: "hacks" },
  { label: "Exclusive NFTs", key: "nfts" },
  { label: "XP Boost", key: "xp" },
];

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "#2ECC71" },
  medium: { label: "Medium", color: "#b9d0ff" },
  hard: { label: "Hard", color: "#f3cc51" },
};

function getDifficultyForEvent(event: Event): { label: string; color: string } {
  // Derive difficulty from tags or default to "Medium"
  const tags = event.tags || [];
  for (const t of tags) {
    const lower = t.toLowerCase();
    if (lower === "easy" || lower === "hard" || lower === "medium") {
      return DIFFICULTY_MAP[lower] || DIFFICULTY_MAP.medium;
    }
  }
  return DIFFICULTY_MAP.medium;
}

function getTypeTag(event: Event): { label: string; color: string } {
  const tags = (event.tags || []).map((t) => t.toLowerCase());
  if (tags.includes("hackathon")) return { label: "Hackathon", color: "#2ECC71" };
  if (tags.includes("mini game") || tags.includes("mini_game")) return { label: "Mini Game", color: "#00D1FF" };
  if (tags.includes("team") || tags.includes("team mission")) return { label: "Team Mission", color: "#f3cc51" };
  return { label: "Quest", color: "#b9d0ff" };
}

function formatParticipants(max: number | null): string {
  if (!max) return "Open";
  if (max >= 1000) return `${(max / 1000).toFixed(0)}K+`;
  return `${max}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"active" | "upcoming">("active");
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["mini_game"]);
  const [selectedRewards, setSelectedRewards] = useState<string[]>(["hacks", "xp"]);
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      if (statusFilter === "active") {
        query = query.eq("status", "running");
      } else {
        query = query.eq("status", "upcoming");
      }

      const { data } = await query;
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [statusFilter]);

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleType = (key: string) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const toggleReward = (key: string) => {
    setSelectedRewards((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  // Placeholder quest cards for when there are no DB events
  const placeholderQuests = [
    {
      id: "placeholder-1",
      name: "Algorand DeFi Challenge",
      description: "Build a decentralized finance application on Algorand blockchain.",
      banner_image: null,
      status: "running",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["hackathon", "hard"],
      max_participants: 1240,
      prize_info: "500 HACKS",
      xp: 2500,
      hacks: 500,
      nft_rarity: "Rare",
    },
    {
      id: "placeholder-2",
      name: "Terminal Infiltrator",
      description: "Navigate through a simulated terminal to find hidden flags and exploits.",
      banner_image: null,
      status: "running",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["mini_game", "easy"],
      max_participants: 4892,
      prize_info: "50 HACKS",
      xp: 500,
      hacks: 50,
      nft_rarity: null,
    },
    {
      id: "placeholder-3",
      name: "Smart Contract Arena",
      description: "Compete with teams to build and deploy the most efficient smart contracts.",
      banner_image: null,
      status: "running",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["team mission", "medium"],
      max_participants: 312,
      prize_info: "200 HACKS",
      xp: 1200,
      hacks: 200,
      nft_rarity: "Epic",
    },
    {
      id: "placeholder-4",
      name: "Duality AI Optimization",
      description: "Optimize AI models and earn massive rewards in this cutting-edge challenge.",
      banner_image: null,
      status: "running",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["hackathon", "medium"],
      max_participants: 856,
      prize_info: "750 HACKS",
      xp: 3000,
      hacks: 750,
      nft_rarity: "Mythic",
    },
  ];

  const displayQuests = filtered.length > 0 ? filtered : placeholderQuests;

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-body selection:bg-[#b9d0ff]/30">
      <div className="flex flex-col lg:flex-row px-6 lg:px-8 gap-8 max-w-[1920px] mx-auto pt-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 space-y-8 shrink-0">
          {/* Type */}
          <section>
            <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#e5e1e4]/40 mb-5 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-[#b9d0ff]" /> Type
            </h3>
            <div className="space-y-3">
              {QUEST_TYPES.map((type) => (
                <label key={type.key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.key)}
                    onChange={() => toggleType(type.key)}
                    className="rounded-sm bg-[#0e0e10] border-[#434750] text-[#b9d0ff] focus:ring-offset-[#131315] w-3.5 h-3.5"
                  />
                  <span className={`font-heading text-[11px] uppercase tracking-widest transition-colors ${
                    selectedTypes.includes(type.key) ? "text-[#e5e1e4]" : "text-[#e5e1e4]/50 group-hover:text-[#b9d0ff]"
                  }`}>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Reward Type */}
          <section>
            <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#e5e1e4]/40 mb-5 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-[#b9d0ff]" /> Reward Type
            </h3>
            <div className="space-y-3">
              {REWARD_TYPES.map((reward) => (
                <label key={reward.key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedRewards.includes(reward.key)}
                    onChange={() => toggleReward(reward.key)}
                    className="rounded-sm bg-[#0e0e10] border-[#434750] text-[#b9d0ff] focus:ring-offset-[#131315] w-3.5 h-3.5"
                  />
                  <span className={`font-heading text-[11px] uppercase tracking-widest transition-colors ${
                    selectedRewards.includes(reward.key) ? "text-[#e5e1e4]" : "text-[#e5e1e4]/50 group-hover:text-[#b9d0ff]"
                  }`}>
                    {reward.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#e5e1e4]/40 mb-5 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-[#b9d0ff]" /> Status
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === "active"}
                  onChange={() => setStatusFilter("active")}
                  className="bg-[#0e0e10] border-[#434750] text-[#b9d0ff] focus:ring-offset-[#131315]"
                />
                <span className={`font-heading text-[11px] uppercase tracking-widest transition-colors ${
                  statusFilter === "active" ? "text-[#e5e1e4]" : "text-[#e5e1e4]/50 group-hover:text-[#b9d0ff]"
                }`}>
                  Active Now
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === "upcoming"}
                  onChange={() => setStatusFilter("upcoming")}
                  className="bg-[#0e0e10] border-[#434750] text-[#b9d0ff] focus:ring-offset-[#131315]"
                />
                <span className={`font-heading text-[11px] uppercase tracking-widest transition-colors ${
                  statusFilter === "upcoming" ? "text-[#e5e1e4]" : "text-[#e5e1e4]/50 group-hover:text-[#b9d0ff]"
                }`}>
                  Coming Soon
                </span>
              </label>
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <section className="flex-grow pb-16">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter mb-2 uppercase text-[#e5e1e4]">
                  Quest Engine
                </h1>
                <p className="font-heading text-[#00D1FF] text-sm tracking-[0.2em] uppercase">
                  Deploy Your Skills. Earn Your Future.
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#434750] text-lg">search</span>
                <input
                  className="w-full bg-[#0e0e10] border-none focus:ring-0 text-[#e5e1e4] font-heading text-[11px] tracking-widest py-3.5 pl-11 pr-4 transition-all focus:bg-[#1c1b1d] border-b-2 border-transparent focus:border-[#b9d0ff] placeholder:text-[#434750] uppercase"
                  placeholder="Search quests, games, or protocols..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </header>

          {/* Quest Grid */}
          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#1c1b1d] animate-pulse h-80 rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <AnimatePresence>
                {displayQuests.map((quest, i) => {
                  const typeTag = getTypeTag(quest as Event);
                  const difficulty = getDifficultyForEvent(quest as Event);
                  // Use placeholder data if available, otherwise derive
                  const xp = (quest as any).xp || 1000;
                  const hacks = (quest as any).hacks || 100;
                  const nftRarity = (quest as any).nft_rarity || null;

                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                      <Link
                        href={quest.id.startsWith("placeholder") ? "#" : `/events/${quest.id}`}
                        className="bg-[#1c1b1d] group relative overflow-hidden transition-all hover:translate-y-[-4px] block"
                      >
                        {/* Image */}
                        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-[#b9d0ff]/10 to-[#131315]">
                          {quest.banner_image ? (
                            <img
                              src={quest.banner_image}
                              alt={quest.name}
                              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center relative">
                              {/* Abstract pattern background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#b9d0ff]/5 via-[#131315] to-[#00D1FF]/5" />
                              <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(185,208,255,0.03) 20px, rgba(185,208,255,0.03) 21px),
                                  repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(185,208,255,0.03) 20px, rgba(185,208,255,0.03) 21px)`,
                              }} />
                              <span className="material-symbols-outlined text-[#b9d0ff]/20 text-5xl relative z-10">explore</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Tags row */}
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className="px-2 py-0.5 font-heading text-[9px] uppercase tracking-widest border"
                              style={{
                                color: typeTag.color,
                                backgroundColor: `${typeTag.color}10`,
                                borderColor: `${typeTag.color}30`,
                              }}
                            >
                              {typeTag.label}
                            </span>
                            <span
                              className="font-heading text-[9px] uppercase tracking-widest"
                              style={{ color: difficulty.color }}
                            >
                              Difficulty: {difficulty.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl font-black font-heading tracking-tight mb-4 uppercase group-hover:text-[#b9d0ff] transition-colors">
                            {quest.name}
                          </h2>

                          {/* Reward grid */}
                          <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="bg-[#0e0e10] p-2.5">
                              <p className="font-heading text-[9px] text-[#e5e1e4]/40 uppercase mb-0.5">XP</p>
                              <p className="font-bold text-[#b9d0ff] text-sm">+{xp.toLocaleString()}</p>
                            </div>
                            <div className="bg-[#0e0e10] p-2.5">
                              <p className="font-heading text-[9px] text-[#e5e1e4]/40 uppercase mb-0.5">HACKS</p>
                              <p className="font-bold text-[#b9d0ff] text-sm">{hacks}</p>
                            </div>
                            <div className="bg-[#0e0e10] p-2.5">
                              <p className="font-heading text-[9px] text-[#e5e1e4]/40 uppercase mb-0.5">NFT</p>
                              <p className={`font-bold text-sm ${nftRarity ? "text-[#f3cc51]" : "text-[#e5e1e4]/20"}`}>
                                {nftRarity || "None"}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm text-[#e5e1e4]/40">groups</span>
                              <span className="font-heading text-[11px] uppercase tracking-widest text-[#e5e1e4]/60">
                                {formatParticipants(quest.max_participants)} Participants
                              </span>
                            </div>
                            <span className="bg-[#91b5f6] text-[#1c467f] px-5 py-2 font-bold uppercase tracking-wider text-[11px] active:scale-95 transition-all inline-block">
                              Join Now
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-10 px-6 lg:px-8 mt-auto bg-[#131315] border-t border-[#e5e1e4]/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1920px] mx-auto">
          <div>
            <span className="text-lg font-bold text-[#e5e1e4] font-heading uppercase">HackQuest</span>
            <p className="font-heading text-[10px] uppercase opacity-50 mt-2">
              © {new Date().getFullYear()} HackQuest. Powered by Algorand & Duality AI.
            </p>
          </div>
          <div className="flex gap-8">
            {["X", "Discord", "GitHub", "Algorand", "Duality AI"].map((link) => (
              <a
                key={link}
                className="font-heading text-[10px] uppercase text-[#e5e1e4]/60 hover:text-[#00D1FF] transition-opacity cursor-pointer"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
            <span className="font-heading text-[10px] uppercase tracking-widest text-[#2ECC71]">
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-[#00D1FF] text-[#131315] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 rounded">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
