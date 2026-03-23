"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { NAV_LINKS } from "@/lib/constants";
import {
  Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Shield,
} from "lucide-react";

interface NavUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
}

export function Navbar() {
  const [user, setUser] = useState<NavUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch user on mount
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginDropdown(false);
      }
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-hq-accent-purple to-hq-accent-violet rounded-lg transform rotate-45 group-hover:rotate-[55deg] transition-transform duration-500" />
              <div className="absolute inset-[3px] bg-hq-bg-primary rounded-[5px] transform rotate-45 group-hover:rotate-[55deg] transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center text-hq-accent-glow font-heading font-bold text-sm">
                H
              </span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              <span className="text-hq-text-primary">HACK</span>
              <span className="gradient-text">QUEST</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-hq-text-secondary hover:text-hq-text-primary transition-colors duration-200 rounded-lg hover:bg-white/[0.04] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-hq-accent-purple to-hq-accent-violet group-hover:w-2/3 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              /* Profile Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-hq-accent-purple/40">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-hq-accent-purple to-hq-accent-violet flex items-center justify-center text-white text-xs font-bold">
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-hq-success rounded-full border-2 border-hq-bg-primary" />
                  </div>
                  <span className="text-sm font-medium text-hq-text-primary max-w-[120px] truncate">
                    {user.display_name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-hq-text-muted transition-transform duration-200 ${
                      profileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-panel p-1.5 border border-white/10"
                    >
                      <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                        <p className="text-sm font-medium text-hq-text-primary truncate">
                          {user.display_name}
                        </p>
                        <p className="text-xs text-hq-text-muted truncate">
                          @{user.username}
                        </p>
                      </div>

                      <Link
                        href={user.role === "organiser" ? "/organiser" : "/dashboard/overview"}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {user.role === "organiser" ? "Organiser Dashboard" : "Dashboard"}
                      </Link>

                      {user.role === "organiser" && (
                        <Link
                          href="/organiser"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
                        >
                          <Shield className="w-4 h-4" />
                          Organiser Panel
                        </Link>
                      )}

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>

                      <div className="border-t border-white/[0.06] mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-hq-danger hover:bg-hq-danger/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login Dropdown */
              <div className="relative" ref={loginRef}>
                <button
                  onClick={() => setLoginDropdown(!loginDropdown)}
                  className="btn-primary flex items-center gap-1.5"
                >
                  <span>Login</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      loginDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {loginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 glass-panel p-1.5 border border-white/10"
                    >
                      <Link
                        href="/login"
                        onClick={() => setLoginDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
                      >
                        <User className="w-4 h-4" />
                        Player Login
                      </Link>
                      <Link
                        href="/organiser-login"
                        onClick={() => setLoginDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
                      >
                        <Shield className="w-4 h-4" />
                        Organiser Login
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-hq-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-hq-text-primary" />
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
            transition={{ duration: 0.2 }}
            className="lg:hidden glass-nav border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04] transition-all"
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
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04] transition-all"
                    >
                      {user.role === "organiser" ? "Organiser Dashboard" : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMobileOpen(false); }}
                      className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-hq-danger hover:bg-hq-danger/10 transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04] transition-all"
                    >
                      Player Login
                    </Link>
                    <Link
                      href="/organiser-login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04] transition-all"
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
