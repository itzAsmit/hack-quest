"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Sparkles, Search, Filter, Rocket, Trophy, Clock, 
  Gamepad2, Users, ArrowRight, Star, Loader2, Play
} from "lucide-react";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { formatNumber, cn } from "@/lib/utils";
import Link from "next/link";

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
  xp_reward?: number;
  hacks_reward?: number;
}

const CATEGORIES = [
  { label: "All Quests", icon: Rocket, key: "all" },
  { label: "Hackathons", icon: Trophy, key: "hackathon" },
  { label: "Mini Games", icon: Gamepad2, key: "mini_game" },
  { label: "Team Missions", icon: Users, key: "team_mission" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filtered = (events.length > 0 ? events : [
    {
      id: "demo-1",
      name: "Algorand DeFi Challenge",
      description: "Build a decentralized finance application on Algorand blockchain.",
      banner_image: null,
      prize_info: null,
      status: "running",
      tags: ["hackathon", "hard"],
      max_participants: 1240,
      xp_reward: 2500,
      hacks_reward: 500,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 604800000).toISOString(),
    },
    {
      id: "demo-2",
      name: "Terminal Infiltrator",
      description: "Navigate through a simulated terminal to find hidden flags.",
      banner_image: null,
      prize_info: null,
      status: "running",
      tags: ["mini_game", "easy"],
      max_participants: 4892,
      xp_reward: 500,
      hacks_reward: 50,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 259200000).toISOString(),
    },
    {
      id: "demo-3",
      name: "Smart Contract Arena",
      description: "Compete with teams to build efficient smart contracts.",
      banner_image: null,
      prize_info: null,
      status: "upcoming",
      tags: ["team_mission", "medium"],
      max_participants: 312,
      xp_reward: 1200,
      hacks_reward: 200,
      start_date: new Date(Date.now() + 86400000).toISOString(),
      end_date: new Date(Date.now() + 1209600000).toISOString(),
    }
  ] as Event[]).filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || e.tags?.some(t => t.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-px bg-hq-accent-purple/50" />
          <span className="text-sm font-bold text-hq-accent-glow uppercase tracking-[0.2em]">
            Quest Engine Alpha
          </span>
          <Sparkles className="w-3.5 h-3.5 text-hq-accent-glow animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tighter">
              Deploy your <span className="gradient-text">Skills</span>
            </h1>
            <p className="max-w-xl mt-4 text-white/50 text-base sm:text-lg">
              Forge your legacy through code. Complete missions, earn XP, and unlock premium rewards in the next generation of hackathons.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search missions, games, protocols..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all text-sm font-bold uppercase tracking-widest whitespace-nowrap",
                active 
                  ? "bg-white text-black border-white" 
                  : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={14} className={active ? "text-black" : "text-white/40"} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((quest, i) => (
              <motion.div
                layout
                key={quest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link href={`/events/${quest.id}`} className="group block h-full">
                  <CardCanvas className="h-full">
                    <Card className="p-0 h-full overflow-hidden flex flex-col group-hover:border-white/20 transition-all">
                      {/* Image Area */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                        {quest.banner_image ? (
                          <img 
                            src={quest.banner_image} 
                            alt={quest.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.08]">
                            <Play fill="white" className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                           <NeonBadge variant={quest.status === 'running' ? 'success' : 'purple'} size="sm" pulse={quest.status === 'running'}>
                             {quest.status.toUpperCase()}
                           </NeonBadge>
                        </div>
                        {quest.xp_reward && (
                           <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tighter text-white">
                             +{formatNumber(quest.xp_reward)} XP
                           </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                           {quest.tags?.map(tag => (
                             <span key={tag} className="text-[9px] font-black uppercase tracking-[0.1em] text-white/30 shrink-0">
                               #{tag}
                             </span>
                           ))}
                        </div>
                        <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight mb-2 group-hover:text-hq-accent-glow transition-colors">
                          {quest.name}
                        </h3>
                        <p className="text-white/40 text-xs line-clamp-2 mb-6 leading-relaxed">
                          {quest.description || "Infiltrate the system and complete mission objectives to earn massive XP and hacks tokens."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1.5">
                               <Users size={12} className="text-white/30" />
                               <span className="text-[10px] font-bold text-white/60">
                                 {quest.max_participants ? formatNumber(quest.max_participants) : "OPEN"}
                               </span>
                             </div>
                             <div className="flex items-center gap-1.5 text-hq-gold">
                               <Star size={12} className="fill-hq-gold" />
                               <span className="text-[10px] font-black uppercase">Legendary</span>
                             </div>
                           </div>
                           <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  </CardCanvas>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
          <Rocket className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Missions Found</h3>
          <p className="text-white/40 text-sm">No quests match your selected filters or search query.</p>
          <button onClick={() => { setActiveCategory("all"); setSearch(""); }} className="mt-6 text-hq-accent-glow font-bold uppercase tracking-widest text-xs hover:underline">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
