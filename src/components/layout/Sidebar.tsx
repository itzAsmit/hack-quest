"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Image, Users, Wallet, Settings, Activity,
  Calendar, Shield, ChevronLeft, ChevronRight
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

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Image, Users, Wallet, Settings, Activity, Calendar, Shield,
};

export function Sidebar({ links, title }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-white/[0.06] bg-hq-bg-secondary/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        {!collapsed && (
          <span className="text-xs font-medium text-hq-text-muted uppercase tracking-wider truncate">
            {title}
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-white/[0.06] text-hq-text-muted hover:text-hq-text-primary transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-hq-accent-purple/15 text-hq-accent-glow border border-hq-accent-purple/20"
                  : "text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04]",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", isActive && "text-hq-accent-glow")} />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
