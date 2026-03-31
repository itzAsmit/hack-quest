"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Shield,
  Bell, Wallet,
} from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";

const APP_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Quests", href: "/events" },
  { label: "Dashboard", href: "/dashboard/overview" },
  { label: "Trading Hall", href: "/trading-hall" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Showplace", href: "/showplace" },
];

interface NavUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
}

export function AppNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<NavUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
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

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <div 
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1240px] transition-all duration-500 ease-in-out ${
        scrolled ? "top-2 md:top-3" : "top-4 md:top-6"
      }`}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={40}
        borderWidth={0.03}
        displace={0.3}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        brightness={20}
        opacity={0.85}
        backgroundOpacity={0.6}
        mixBlendMode="normal"
        className="shadow-[0_0_30px_-8px_rgba(110,168,255,0.35),0_0_60px_-15px_rgba(110,168,255,0.15)]"
      >
        <div className="flex justify-between items-center px-5 md:px-7 py-2.5">
          {/* Left: Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 relative shrink-0 group">
              <div className="absolute top-1/2 left-1 w-10 h-8 bg-[rgba(110,168,255,0.15)] blur-[14px] rounded-full -translate-y-1/2 pointer-events-none group-hover:bg-[rgba(110,168,255,0.25)] transition-colors" />
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-transparent shrink-0 relative z-10 group-hover:border-white/40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <line x1="22" y1="8.5" x2="12" y2="12" />
                  <line x1="2" y1="8.5" x2="12" y2="12" />
                </svg>
              </div>
              <span className="text-base font-black tracking-tighter text-white uppercase font-heading hidden sm:block relative z-10 transition-transform group-hover:scale-105">
                HackQuest
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6 font-medium text-[13px] tracking-tight">
              {APP_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all relative py-2 ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span 
                      layoutId="nav-active"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[110%] h-[2px] bg-[#6ea8ff] shadow-[0_0_10px_2px_rgba(110,168,255,0.5)] rounded-full" 
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors rounded-full shrink-0">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors rounded-full shrink-0">
                    <Wallet className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#b9d0ff]/40 shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#6D28D9] to-[#D946EF] flex items-center justify-center text-white text-[10px] font-bold">
                          {user.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden md:block text-[12px] font-semibold text-white/90 max-w-[80px] truncate">
                      {user.display_name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${profileDropdown ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 bg-[#131315]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl z-[60]"
                      >
                        <div className="px-3 py-3 border-b border-white/[0.06] mb-1">
                          <p className="text-sm font-bold text-white truncate">{user.display_name}</p>
                          <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase truncate">@{user.username}</p>
                        </div>

                        <Link
                          href={user.role === "organiser" ? "/organiser" : "/dashboard/overview"}
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>

                        <div className="border-t border-white/[0.06] mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-5">
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-full bg-[#b9d0ff] text-[#131315] font-bold text-[12px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_-3px_rgba(185,208,255,0.4)]"
                >
                  Join Quest
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/5 transition-colors text-white/70"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden px-4 pb-6 pt-2 border-t border-white/5 overflow-hidden"
            >
              <div className="space-y-1">
                {APP_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "text-[#b9d0ff] bg-[#b9d0ff]/5"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!user && (
                   <div className="pt-4 grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-11 rounded-xl bg-white/5 text-white/80 font-medium text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-11 rounded-xl bg-[#b9d0ff] text-[#131315] font-bold text-sm"
                      >
                        Register
                      </Link>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassSurface>
    </div>
  );
}
