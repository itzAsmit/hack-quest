"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Sparkles, Search, Filter, Rocket, Trophy, Clock, 
  Gamepad2, Users, ArrowRight, Star, Loader2, Play,
  ShoppingBag, Shield, HandCoins, Info, ChevronLeft
} from "lucide-react";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { formatNumber, cn } from "@/lib/utils";
import Link from "next/link";

interface NFTDefinition {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  nft_type: string;
  rarity_color: string;
  xp_cost: number | null;
  total_supply: number;
  minted_count: number;
}

interface OwnedNFT {
  nft_def_id: string;
  owner_id: string;
  users: { username: string; display_name: string } | null;
}

const RARITY_MAP: Record<string, { label: string; color: string; badge: string }> = {
  common: { label: "Common", color: "#94a3b8", badge: "slate" },
  rare: { label: "Rare", color: "#3b82f6", badge: "purple" },
  epic: { label: "Epic", color: "#a855f7", badge: "purple" },
  legendary: { label: "Legendary", color: "#f59e0b", badge: "gold" },
  mythic: { label: "Mythic", color: "#ef4444", badge: "danger" },
};

export default function ShowplacePage() {
  const [nfts, setNfts] = useState<NFTDefinition[]>([]);
  const [owned, setOwned] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [rarityFilter, setRarityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userXp, setUserXp] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: userData } = await supabase
          .from("users")
          .select("total_xp")
          .eq("id", user.id)
          .single();
        if (userData) setUserXp(userData.total_xp);
      }

      const { data: nftData } = await supabase
        .from("nft_definitions")
        .select("*")
        .order("created_at", { ascending: false });

      if (nftData) setNfts(nftData);

      const { data: ownedData } = await supabase
        .from("nft_ownership")
        .select("nft_def_id, owner_id, users(username, display_name)");

      if (ownedData) setOwned(ownedData as unknown as OwnedNFT[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = nfts.filter((nft) => {
    if (rarityFilter !== "All" && nft.rarity_color !== rarityFilter.toLowerCase()) return false;
    if (search && !nft.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getOwner = (nftDefId: string) => {
    return owned.find((o) => o.nft_def_id === nftDefId);
  };

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
            Artifact Collection
          </span>
          <ShoppingBag className="w-3.5 h-3.5 text-hq-accent-glow animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tighter">
              NFT <span className="gradient-text">Showplace</span>
            </h1>
            <p className="max-w-xl mt-4 text-white/50 text-base sm:text-lg">
              Collect and showcase rare digital assets. Claim basic tier artifacts using your earned XP or discover legendary treasures in the auction hall.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {userId && (
              <GlassPanel className="px-4 py-3 flex items-center justify-between border-white/10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Your XP Balance</span>
                 <span className="text-sm font-black gradient-text-gold">{formatNumber(userXp)} XP</span>
              </GlassPanel>
            )}
          </div>
        </div>
      </motion.div>

      {/* Rarity Selector */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
         {["All", "Common", "Rare", "Epic", "Legendary", "Mythic"].map((r) => (
           <button
             key={r}
             onClick={() => setRarityFilter(r)}
             className={cn(
                "px-5 py-2.5 rounded-full border transition-all text-[11px] font-black uppercase tracking-widest whitespace-nowrap",
                rarityFilter === r
                  ? "bg-white text-black border-white"
                  : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
             )}
           >
             {r}
           </button>
         ))}
      </div>

      {/* NFT Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <AnimatePresence mode="popLayout">
              {filtered.map((nft, i) => {
                 const owner = getOwner(nft.id);
                 const isOwnedByMe = owner?.owner_id === userId;
                 const rarity = RARITY_MAP[nft.rarity_color.toLowerCase()] || RARITY_MAP.common;

                 return (
                   <motion.div
                     layout
                     key={nft.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.3, delay: i * 0.05 }}
                   >
                     <CardCanvas className="h-full">
                        <Card className="p-0 h-full overflow-hidden flex flex-col group hover:border-white/20 transition-all">
                           <div className="aspect-square relative overflow-hidden bg-white/5">
                              <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <NeonBadge variant={rarity.badge as any} size="sm" pulse={nft.rarity_color.toLowerCase() === 'mythic'}>
                                  {rarity.label.toUpperCase()}
                                </NeonBadge>
                                <NeonBadge variant="slate" size="sm" className="bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                  {nft.nft_type.toUpperCase()}
                                </NeonBadge>
                              </div>
                              {owner && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
                                      {isOwnedByMe ? "OWNED BY YOU" : `OWNED BY ${owner.users?.display_name || "MEMBER"}`}
                                   </div>
                                </div>
                              )}
                           </div>
                           <div className="p-5 flex-1 flex flex-col">
                              <h3 className="font-heading font-black text-lg text-white group-hover:text-hq-accent-glow transition-colors mb-2 uppercase tracking-tighter">
                                {nft.name}
                              </h3>
                              <p className="text-[10px] text-white/40 line-clamp-2 mb-6 leading-relaxed flex-1">
                                {nft.description || "Experimental digital artifact recovered from system archives. Highly valuable property."}
                              </p>

                              <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-end justify-between">
                                 <div>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-0.5">ESTIMATED VALUE</p>
                                   <p className="text-xl font-black text-white">{nft.xp_cost ? formatNumber(nft.xp_cost) : "PRIVATE"} <span className="text-xs text-white/40 font-medium">XP</span></p>
                                 </div>
                                 <div className="flex flex-col items-end gap-1.5">
                                   {nft.nft_type === 'premium' ? (
                                      <Link href="/auction" className="text-[10px] font-black uppercase tracking-widest text-hq-gold hover:underline">AUCTION ONLY</Link>
                                   ) : (
                                      <button className={cn(
                                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                                        owner ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-white text-black hover:bg-white/90"
                                      )}>
                                        {owner ? "CLAIMED" : "REDEEM"}
                                      </button>
                                   )}
                                 </div>
                              </div>
                           </div>
                        </Card>
                     </CardCanvas>
                   </motion.div>
                 );
              })}
           </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
          <Shield className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Registry Empty</h3>
          <p className="text-white/40 text-sm">No artifacts match your selected rarity or search query.</p>
          <button onClick={() => { setRarityFilter("All"); setSearch(""); }} className="mt-6 text-hq-accent-glow font-bold uppercase tracking-widest text-xs hover:underline">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
