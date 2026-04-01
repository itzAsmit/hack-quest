"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Image, Users, Wallet, Settings, Activity,
  Calendar, Shield, ChevronLeft, ChevronRight, type LucideIcon
} from "lucide-react";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarLink {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  links: readonly SidebarLink[];
  title: string;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Image, Users, Wallet, Settings, Activity, Calendar, Shield,
};



export function Sidebar({ links, title }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-24 bottom-0 z-40 flex flex-col border-r border-white/[0.06] bg-black/60 backdrop-blur-3xl transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        {!collapsed && (
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] truncate">
            {title}
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors border border-transparent hover:border-white/10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-300 border",
                isActive
                  ? "bg-white/5 text-white border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                  : "text-white/40 border-transparent hover:text-white hover:bg-white/[0.03]",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={cn("w-4.5 h-4.5 flex-shrink-0 transition-colors", isActive ? "text-[#9D50FF]" : "group-hover:text-white")} />
              {!collapsed && <span className="truncate tracking-tight">{link.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1 h-1 rounded-full bg-[#9D50FF] shadow-[0_0_8px_#9D50FF]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
