"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
} from "lucide-react";

const APP_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Quest", href: "/events" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Trading Hall", href: "/trading-hall" },
  { label: "NFT Marketplace", href: "/showplace" },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isRaised, setIsRaised] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;

      setIsCompact(currentY > 16);
      setIsRaised(isScrollingDown && currentY > 64);

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/events") return pathname === "/events" || pathname?.startsWith("/events/");
    return pathname === href || pathname?.startsWith(href + "/");
  };

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <motion.div
      className="fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-[1540px] -translate-x-1/2"
      animate={{
        y: isRaised ? -10 : 0,
        top: isCompact ? 8 : 16,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="rounded-[999px] border border-transparent bg-black/65 px-4 md:px-6 backdrop-blur-xl shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
        <motion.div
          className="grid grid-cols-[1fr_auto_1fr] items-center"
          animate={{
            minHeight: isCompact ? 56 : 66,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Left: logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <line x1="22" y1="8.5" x2="12" y2="12" />
                  <line x1="2" y1="8.5" x2="12" y2="12" />
                </svg>
              </div>
              <span className="text-base font-black tracking-tight text-white uppercase font-heading hidden sm:block">
                HACKQUEST
              </span>
            </Link>
          </div>

          {/* Center: main nav */}
          <div className="hidden lg:flex items-center justify-center gap-8 text-[14px] font-medium text-white/70">
            {APP_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  isActive(link.href) ? "text-white" : "hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="app-nav-active"
                    className="absolute -bottom-1 left-1/2 h-[2px] w-[110%] -translate-x-1/2 rounded-full bg-white/80"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right: CTA + mobile trigger */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/overview"
              className="hidden md:inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/20"
            >
              Launch App
            </Link>

            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/8 transition-colors text-white/80"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="px-2 pb-4 pt-2 space-y-1">
                {APP_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/dashboard/overview"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center h-11 rounded-xl bg-white/15 text-white font-semibold text-sm hover:bg-white/20"
                >
                  Launch App
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
