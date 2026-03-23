"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Users, UserPlus, Search, Check, X, Clock } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber } from "@/lib/utils";

interface Friend {
  id: string;
  status: string;
  friend_id: string;
  user_id: string;
  friend_profile: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    total_xp: number;
    nft_count: number;
  } | null;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Friends where I sent request
      const { data: sentData } = await supabase
        .from("friends")
        .select("id, status, friend_id, user_id")
        .eq("user_id", user.id);

      // Friends where I received request
      const { data: receivedData } = await supabase
        .from("friends")
        .select("id, status, friend_id, user_id")
        .eq("friend_id", user.id);

      const allFriendships = [...(sentData || []), ...(receivedData || [])];

      // Fetch profiles for all friends
      const friendIds = allFriendships.map((f) =>
        f.user_id === user.id ? f.friend_id : f.user_id
      );

      if (friendIds.length > 0) {
        const { data: profiles } = await supabase
          .from("users")
          .select("id, username, display_name, avatar_url, total_xp, nft_count")
          .in("id", friendIds);

        const enriched = allFriendships.map((f) => {
          const friendUserId = f.user_id === user.id ? f.friend_id : f.user_id;
          return {
            ...f,
            friend_profile: profiles?.find((p) => p.id === friendUserId) || null,
          };
        });

        setFriends(enriched.filter((f) => f.status === "accepted"));
        setPending(enriched.filter((f) => f.status === "pending"));
      }

      setLoading(false);
    };
    fetchFriends();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;
    const { data } = await supabase
      .from("users")
      .select("id, username, display_name, avatar_url")
      .ilike("username", `%${searchQuery}%`)
      .neq("id", userId)
      .limit(5);
    setSearchResults(data || []);
  };

  const sendRequest = async (friendId: string) => {
    if (!userId) return;
    await supabase.from("friends").insert({ user_id: userId, friend_id: friendId });
    setSearchResults((prev) => prev.filter((r) => r.id !== friendId));
  };

  const respondRequest = async (friendshipId: string, accept: boolean) => {
    if (accept) {
      await supabase.from("friends").update({ status: "accepted" }).eq("id", friendshipId);
    } else {
      await supabase.from("friends").delete().eq("id", friendshipId);
    }
    setPending((prev) => prev.filter((f) => f.id !== friendshipId));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Friends</h1>
        <p className="text-sm text-hq-text-muted mt-1">
          Connect with other players
        </p>
      </motion.div>

      {/* Search */}
      <GlassPanel className="p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hq-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by username..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary text-sm px-5">
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-hq-bg-tertiary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-hq-accent-purple/30">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                        {user.display_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hq-text-primary">{user.display_name}</p>
                    <p className="text-xs text-hq-text-muted">@{user.username}</p>
                  </div>
                </div>
                <button onClick={() => sendRequest(user.id)} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Add
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-hq-gold" />
            Pending Requests ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map((f) => (
              <GlassPanel key={f.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-hq-accent-purple/30">
                    {f.friend_profile?.avatar_url ? (
                      <img src={f.friend_profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                        {f.friend_profile?.display_name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hq-text-primary">{f.friend_profile?.display_name}</p>
                    <p className="text-xs text-hq-text-muted">@{f.friend_profile?.username}</p>
                  </div>
                </div>
                {f.friend_id === userId ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => respondRequest(f.id, true)} className="p-2 rounded-lg bg-hq-success/10 hover:bg-hq-success/20 text-hq-success transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => respondRequest(f.id, false)} className="p-2 rounded-lg bg-hq-danger/10 hover:bg-hq-danger/20 text-hq-danger transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <NeonBadge variant="slate" size="sm">Sent</NeonBadge>
                )}
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-hq-accent-glow" />
          Friends ({friends.length})
        </h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/[0.03] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : friends.length === 0 ? (
          <GlassPanel className="p-8 text-center">
            <Users className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
            <p className="text-sm text-hq-text-muted">No friends yet. Search for players above!</p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {friends.map((f) => (
              <GlassPanel key={f.id} hover className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-hq-accent-purple/30 flex-shrink-0">
                  {f.friend_profile?.avatar_url ? (
                    <img src={f.friend_profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                      {f.friend_profile?.display_name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-hq-text-primary truncate">{f.friend_profile?.display_name}</p>
                  <p className="text-xs text-hq-text-muted">@{f.friend_profile?.username}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium gradient-text-gold">{formatNumber(f.friend_profile?.total_xp || 0)} XP</p>
                  <p className="text-[10px] text-hq-text-muted">{f.friend_profile?.nft_count || 0} NFTs</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
