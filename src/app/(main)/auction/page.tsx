"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Gavel, Sparkles, Filter, Clock, Search, Gift, 
  HandCoins, Rocket, Play, TrendingUp, Zap, Star
} from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber, cn } from "@/lib/utils";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import Link from "next/link";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  rarity_color: string;
  current_bid: number;
  highest_bidder: string | null;
  start_price: number;
  min_bid_increment: number;
  end_time: string;
  status: string;
  total_bids?: number;
}

export default function TradingHallPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    const fetchAuction = async () => {
      const { data } = await supabase
        .from("auction_products")
        .select("*")
        .order("end_time", { ascending: true });

      if (data) setProducts(data);
      setLoading(false);
    };
    fetchAuction();
  }, []);

  const displayProducts = (products.length > 0 ? products : [
    {
      id: "demo-1",
      name: "Nebula Core #001",
      description: "Genesis rarity core component. Extremely rare and powerful artifact for the upcoming expansion.",
      image_url: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
      rarity_color: "mythic",
      current_bid: 12500,
      min_bid_increment: 500,
      end_time: new Date(Date.now() + 86400000).toISOString(),
      status: "active",
      total_bids: 24
    },
    {
      id: "demo-2",
      name: "Stellar Shard",
      description: "A piece of a fallen star, used to upgrade legendary tier items and weapons.",
      image_url: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?auto=format&fit=crop&q=80&w=800",
      rarity_color: "legendary",
      current_bid: 4200,
      min_bid_increment: 100,
      end_time: new Date(Date.now() + 172800000).toISOString(),
      status: "active",
      total_bids: 12
    },
    {
       id: "demo-3",
       name: "Quantum Relic",
       description: "Encrypted memory fragment containing designs for top-tier player armor.",
       image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
       rarity_color: "epic",
       current_bid: 1800,
       min_bid_increment: 50,
       end_time: new Date(Date.now() + 3600000).toISOString(),
       status: "active",
       total_bids: 56
    }
  ]).filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-px bg-hq-gold/50" />
          <span className="text-sm font-bold text-hq-gold uppercase tracking-[0.2em]">
            Elite Registry
          </span>
          <Gavel className="w-3.5 h-3.5 text-hq-gold animate-bounce" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tighter">
              Trading <span className="gradient-text">Hall</span>
            </h1>
            <p className="max-w-xl mt-4 text-white/50 text-base sm:text-lg">
              Acquire exclusive artifacts, limited-run NFTs, and rare assets through competitive bidding. Settle transactions securely with XP or HACKS.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search current auctions..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Featured Auction */}
      {!loading && displayProducts.length > 0 && (
         <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-12"
         >
           <CardCanvas className="relative">
              <Card className="p-0 border-hq-gold/20 overflow-hidden lg:grid lg:grid-cols-2 bg-gradient-to-br from-hq-gold/[0.03] to-transparent">
                 <div className="relative aspect-[4/3] lg:aspect-auto h-full overflow-hidden bg-white/5">
                    <img src={displayProducts[0].image_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent lg:hidden" />
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                       <NeonBadge variant="gold" pulse size="lg" className="shadow-[0_0_20px_rgba(243,204,81,0.2)]">HOT AUCTION</NeonBadge>
                       <NeonBadge variant="slate" size="sm">GENESIS RARITY</NeonBadge>
                    </div>
                 </div>
                 <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-hq-gold mb-4">
                       <TrendingUp size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Currently Trending</span>
                    </div>
                    <h2 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tighter mb-4">
                      {displayProducts[0].name}
                    </h2>
                    <p className="text-white/50 text-base mb-8 leading-relaxed max-w-md">
                      {displayProducts[0].description}
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Current Bid</p>
                          <div className="text-3xl font-black gradient-text-gold">
                             <AnimatedCounter value={displayProducts[0].current_bid} suffix=" XP" />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Time Left</p>
                          <div className="text-3xl font-black text-white flex items-center gap-2">
                             <Clock className="w-6 h-6 text-hq-danger animate-pulse" />
                             <span>2H 45M</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/auction/${displayProducts[0].id}`} className="flex-1 bg-white text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all">
                           Place your Bid <Gavel size={14} />
                        </Link>
                        <button className="px-8 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all">
                           Watch Asset
                        </button>
                    </div>
                 </div>
              </Card>
           </CardCanvas>
         </motion.div>
      )}

      {/* Grid of Other Auctions */}
      <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-3">
         <div className="h-px flex-1 bg-white/[0.05]" /> NEWEST LISTINGS <div className="h-px flex-1 bg-white/[0.05]" />
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse" />
          ))
        ) : (
          displayProducts.slice(1).map((p, i) => (
             <motion.div
               key={p.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
             >
                <Link href={`/auction/${p.id}`} className="group block">
                   <CardCanvas>
                      <Card className="p-0 border-white/10 overflow-hidden flex flex-col group-hover:border-white/20 transition-all">
                         <div className="aspect-square w-full relative overflow-hidden bg-white/5">
                            <img src={p.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 right-4">
                               <NeonBadge variant="slate" size="sm">#{p.rarity_color.toUpperCase()}</NeonBadge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <div className="p-6">
                            <h4 className="font-heading font-black text-lg text-white group-hover:text-hq-accent-glow transition-colors">{p.name}</h4>
                            <div className="flex items-center gap-2 text-white/30 text-[10px] mb-4 uppercase tracking-tighter">
                               <Play size={10} className="fill-white/30" /> {p.total_bids || 0} TOTAL BIDS SOUGHT
                            </div>
                            
                            <div className="flex items-end justify-between">
                               <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">CURRENT BID</p>
                                  <p className="text-xl font-black text-white">{formatNumber(p.current_bid)} <span className="text-xs text-white/40 font-medium">XP</span></p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-hq-danger mb-0.5">ENDS IN</p>
                                  <p className="text-sm font-bold text-white uppercase tracking-tighter">18H 32M</p>
                               </div>
                            </div>
                         </div>
                      </Card>
                   </CardCanvas>
                </Link>
             </motion.div>
          ))
        )}
      </div>

      {!loading && displayProducts.length <= 1 && (
         <div className="text-center py-20 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10 mt-12">
            <HandCoins className="w-16 h-16 mx-auto text-white/10 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Private Lobby</h3>
            <p className="text-white/40 text-sm">No additional auctions are currently active in the Trading Hall.</p>
         </div>
      )}
    </div>
  );
}
