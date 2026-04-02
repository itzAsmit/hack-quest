"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Zap, ChevronDown, User, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useLoading } from "@/components/shared/LoadingProvider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Quest", href: "/events" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Trading Hall", href: "/auction" },
  { label: "NFT Marketplace", href: "/showplace" },
];

interface NavUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
}

export function UnifiedNavbar() {
  const { hasLoadedOnce } = useLoading();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  // Don't show navbar if we are on the home page and haven't finished loading yet
  const isInitialLoading = pathname === "/" && !hasLoadedOnce;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch User
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from("users")
          .select("id, username, display_name, avatar_url, role")
          .eq("id", authUser.id)
          .single();
        if (data) setUser(data);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
      else getUser();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileDropdown(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/events") return pathname === "/events" || pathname?.startsWith("/events/");
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <AnimatePresence>
      {!isInitialLoading && (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ left: "50%", x: "-50%" }}
          className={cn(
            "fixed top-4 z-[100] w-[calc(100%-2rem)] max-w-[1200px] transition-all duration-300",
            mobileOpen ? "rounded-[32px]" : "rounded-full"
          )}
        >
          <div className={cn(
            "relative w-full transition-all duration-500 rounded-full",
            "bg-black/60 backdrop-blur-2xl border border-white/15",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)]",
            mobileOpen && "rounded-[28px] bg-black/95"
          )}>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-2">
              <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity pl-2">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <line x1="12" y1="22" x2="12" y2="12" />
                    <line x1="22" y1="8.5" x2="12" y2="12" />
                    <line x1="2" y1="8.5" x2="12" y2="12" />
                  </svg>
                </div>
                <span className="hidden sm:block font-heading text-sm font-black uppercase tracking-tighter text-white">
                  HackQuest
                </span>
              </Link>

              <div className="hidden lg:flex items-center justify-center gap-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative text-[13px] font-medium tracking-tight transition-all py-1 px-1",
                      isActive(link.href) 
                        ? "text-white" 
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 pr-1">
                {user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden ring-1 ring-white/20">
                         {user.avatar_url ? (
                           <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                         ) : (
                           user.display_name.charAt(0)
                         )}
                      </div>
                      <span className="hidden md:block text-[12px] font-medium text-white/90 max-w-[80px] truncate">{user.display_name}</span>
                      <ChevronDown size={14} className={cn("text-white/40 transition-transform", profileDropdown && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[20px] p-2 shadow-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/5 mb-1">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{user.display_name}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-tighter">@{user.username}</p>
                          </div>
                          <Link href="/dashboard/overview" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <Link href="/dashboard/settings" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <User size={16} /> Profile Settings
                          </Link>
                          {user.role === 'organiser' && (
                            <Link href="/organiser" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                              <Shield size={16} /> Organiser Panel
                            </Link>
                          )}
                          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-colors text-left">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:flex items-center gap-2 bg-white text-black hover:bg-white/90 text-[12px] font-bold px-5 py-2.5 rounded-full transition-all whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
                  >
                    Launch App
                  </Link>
                )}
                
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden px-4 pb-6 pt-2"
                >
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-heading uppercase text-xs tracking-widest border",
                          isActive(link.href)
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {link.label}
                        {isActive(link.href) && <Zap size={12} className="text-white" />}
                      </Link>
                    ))}
                    {!user && (
                       <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="mt-4 flex items-center justify-center w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em]"
                      >
                        Launch App
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
