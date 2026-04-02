"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Search, Users, Zap, Star, Shield, Filter, Loader2 } from "lucide-react";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { cn, formatNumber } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url, total_xp")
        .order("total_xp", { ascending: false })
        .limit(100);

      if (data) {
        const rankedUsers = data.map((u, i) => ({
          ...u,
          level: Math.floor(Math.sqrt(u.total_xp / 100)) + 1,
          rank: i + 1,
        }));
        setUsers(rankedUsers);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = users.slice(0, 3);
  const others = filteredUsers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-white animate-pulse" />
          <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">
            Global Rankings
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-4 uppercase tracking-tighter">
          Hall of <span className="gradient-text">Legends</span>
        </h1>
        <p className="max-w-2xl mx-auto text-white/50 text-base sm:text-lg">
          Compete with developers worldwide. Earn XP by completing quests and ranking in seasonal events.
        </p>
      </motion.div>

      {/* Podium for Top 3 */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end max-w-5xl mx-auto">
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <CardCanvas>
              <Card className="p-6 text-center border-white/10 bg-white/[0.02]">
                <div className="relative mx-auto w-20 h-20 mb-4">
                   <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-400 border-2 border-black flex items-center justify-center font-black text-xs text-black z-10">
                    2
                   </div>
                   <div className="w-full h-full rounded-full border-2 border-slate-400/50 p-1">
                     <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                        {topThree[1].avatar_url ? (
                          <img src={topThree[1].avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold">{topThree[1].display_name.charAt(0)}</div>
                        )}
                     </div>
                   </div>
                </div>
                <h3 className="font-heading font-bold text-white truncate">{topThree[1].display_name}</h3>
                <p className="text-xs text-white/40 mb-3 tracking-tighter uppercase">@{topThree[1].username}</p>
                <NeonBadge variant="slate" size="sm" className="mb-2">LEVEL {topThree[1].level}</NeonBadge>
                <div className="text-xl font-black gradient-text-silver">{formatNumber(topThree[1].total_xp)} XP</div>
              </Card>
            </CardCanvas>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 md:order-2 md:pb-8"
          >
             <CardCanvas>
              <Card className="p-8 text-center border-indigo-500/30 bg-indigo-500/5 scale-110 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                <div className="relative mx-auto w-24 h-24 mb-6">
                   <Star className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-indigo-400 fill-indigo-400 animate-bounce" />
                   <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 border-2 border-black flex items-center justify-center font-black text-sm text-white z-10">
                    1
                   </div>
                   <div className="w-full h-full rounded-full border-4 border-indigo-500/50 p-1 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                     <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                        {topThree[0].avatar_url ? (
                          <img src={topThree[0].avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold">{topThree[0].display_name.charAt(0)}</div>
                        )}
                     </div>
                   </div>
                </div>
                <h3 className="font-heading font-black text-xl text-white truncate">{topThree[0].display_name}</h3>
                <p className="text-xs text-white/40 mb-4 tracking-tighter uppercase">@{topThree[0].username}</p>
                <NeonBadge variant="purple" pulse className="mb-2">LEVEL {topThree[0].level}</NeonBadge>
                <div className="text-3xl font-black gradient-text">{formatNumber(topThree[0].total_xp)} XP</div>
              </Card>
            </CardCanvas>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-3"
          >
            <CardCanvas>
              <Card className="p-6 text-center border-white/10 bg-white/[0.02]">
                <div className="relative mx-auto w-20 h-20 mb-4">
                   <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-hq-gold border-2 border-black flex items-center justify-center font-black text-xs text-black z-10">
                    3
                   </div>
                   <div className="w-full h-full rounded-full border-2 border-hq-gold/50 p-1">
                     <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                        {topThree[2].avatar_url ? (
                          <img src={topThree[2].avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold">{topThree[2].display_name.charAt(0)}</div>
                        )}
                     </div>
                   </div>
                </div>
                <h3 className="font-heading font-bold text-white truncate">{topThree[2].display_name}</h3>
                <p className="text-xs text-white/40 mb-3 tracking-tighter uppercase">@{topThree[2].username}</p>
                <NeonBadge variant="gold" size="sm" className="mb-2">LEVEL {topThree[2].level}</NeonBadge>
                <div className="text-xl font-black text-hq-gold">{formatNumber(topThree[2].total_xp)} XP</div>
              </Card>
            </CardCanvas>
          </motion.div>
        </div>
      )}

      {/* Main Stats Table */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or username..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <GlassPanel className="overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Rank</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Competitor</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hidden sm:table-cell">Level</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                   Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-4 bg-white/5 rounded" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-full" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-white/5 rounded" />
                            <div className="h-3 w-20 bg-white/5 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-white/5 rounded mx-auto" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-white/5 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  others.map((u, i) => (
                    <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                         <span className={cn(
                           "text-sm font-black italic",
                           u.rank === 1 ? "text-indigo-400" : u.rank === 2 ? "text-slate-400" : u.rank === 3 ? "text-hq-gold" : "text-white/20"
                         )}>
                           #{u.rank}
                         </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold">{u.display_name.charAt(0)}</div>
                              )}
                            </div>
                            {u.rank <= 3 && (
                               <div className={cn(
                                 "absolute -top-1 -right-1 w-4 h-4 rounded-full border border-black z-10",
                                 u.rank === 1 ? "bg-indigo-500" : u.rank === 2 ? "bg-slate-400" : "bg-hq-gold"
                               )} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-hq-accent-glow transition-colors">{u.display_name}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-tighter">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center hidden sm:table-cell">
                         <NeonBadge variant={u.rank <= 3 ? (u.rank === 1 ? "gold" : "purple") : "slate"} size="sm">
                           Lv. {u.level}
                         </NeonBadge>
                      </td>
                      <td className="px-6 py-5 text-right font-black tracking-tight text-sm">
                        {formatNumber(u.total_xp)} <span className="text-[10px] text-white/30 font-medium">XP</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassPanel>
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 mt-4">
             <Search className="w-12 h-12 mx-auto text-white/10 mb-4" />
             <p className="text-white/40">No legends found matching &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
