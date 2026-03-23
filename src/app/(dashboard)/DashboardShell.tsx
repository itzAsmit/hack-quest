"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DASHBOARD_LINKS } from "@/lib/constants";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hq-bg-primary">
      <Navbar />
      <Sidebar links={DASHBOARD_LINKS} title="Player Dashboard" />
      <main className="pl-60 pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
