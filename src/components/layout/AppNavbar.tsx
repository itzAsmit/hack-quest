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

const APP_NAV_LINKS = [
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
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
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

    return () => subscription.unsubscribe();
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
    if (href === "/events") return pathname === "/events" || pathname?.startsWith("/events/");
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center px-6 lg:px-8 py-3 max-w-[1920px] mx-auto">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-black tracking-tighter text-[#e5e1e4] uppercase font-heading">
            HackQuest
          </Link>
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
            {APP_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-0.5 ${
                  isActive(link.href)
                    ? "text-[#b9d0ff] border-b-2 border-[#b9d0ff]"
                    : "text-[#e5e1e4]/60 hover:text-[#e5e1e4]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="p-2 text-[#e5e1e4]/60 hover:bg-[#b9d0ff]/10 transition-all duration-300 rounded active:scale-95">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#e5e1e4]/60 hover:bg-[#b9d0ff]/10 transition-all duration-300 rounded active:scale-95">
                <Wallet className="w-5 h-5" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#b9d0ff]/40">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#6D28D9] to-[#D946EF] flex items-center justify-center text-white text-xs font-bold">
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2ECC71] rounded-full border border-[#131315]" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-[#e5e1e4] max-w-[100px] truncate">
                    {user.display_name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#e5e1e4]/50 transition-transform ${profileDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#1c1b1d] border border-white/10 rounded-lg p-1.5 shadow-2xl"
                    >
                      <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                        <p className="text-sm font-medium text-[#e5e1e4] truncate">{user.display_name}</p>
                        <p className="text-xs text-[#e5e1e4]/50 truncate">@{user.username}</p>
                      </div>

                      <Link
                        href={user.role === "organiser" ? "/organiser" : "/dashboard/overview"}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#e5e1e4]/70 hover:text-[#e5e1e4] hover:bg-white/[0.06] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {user.role === "organiser" ? "Organiser Dashboard" : "Dashboard"}
                      </Link>

                      {user.role === "organiser" && (
                        <Link
                          href="/organiser"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#e5e1e4]/70 hover:text-[#e5e1e4] hover:bg-white/[0.06] transition-all"
                        >
                          <Shield className="w-4 h-4" />
                          Organiser Panel
                        </Link>
                      )}

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#e5e1e4]/70 hover:text-[#e5e1e4] hover:bg-white/[0.06] transition-all"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>

                      <div className="border-t border-white/[0.06] mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-[#e5e1e4]/60 hover:text-[#e5e1e4] transition-colors"
              >
                Player Login
              </Link>
              <Link
                href="/organiser-login"
                className="hidden md:block text-sm font-medium text-[#e5e1e4]/60 hover:text-[#e5e1e4] transition-colors"
              >
                Organiser Login
              </Link>
              <Link
                href="/register"
                className="bg-[#91b5f6] text-[#1c467f] px-5 py-2 font-bold uppercase tracking-wider text-xs hover:brightness-110 transition-all active:scale-95 rounded"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#e5e1e4]" />
            ) : (
              <Menu className="w-5 h-5 text-[#e5e1e4]" />
            )}
          </button>
        </div>
      </div>

      {/* Gradient line at bottom */}
      <div className="bg-gradient-to-r from-[#b9d0ff]/20 to-transparent h-[1px] w-full absolute bottom-0" />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#131315] border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {APP_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-[#b9d0ff] bg-[#b9d0ff]/10"
                      : "text-[#e5e1e4]/60 hover:text-[#e5e1e4] hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.06] pt-3 mt-3 space-y-1">
                {user ? (
                  <>
                    <Link
                      href={user.role === "organiser" ? "/organiser" : "/dashboard/overview"}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#e5e1e4]/60 hover:text-[#e5e1e4] hover:bg-white/[0.04] transition-all"
                    >
                      {user.role === "organiser" ? "Organiser Dashboard" : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMobileOpen(false); }}
                      className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#e5e1e4]/60 hover:text-[#e5e1e4] hover:bg-white/[0.04] transition-all"
                    >
                      Player Login
                    </Link>
                    <Link
                      href="/organiser-login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#e5e1e4]/60 hover:text-[#e5e1e4] hover:bg-white/[0.04] transition-all"
                    >
                      Organiser Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
