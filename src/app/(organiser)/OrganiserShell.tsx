"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ORGANISER_LINKS } from "@/lib/constants";

export function OrganiserShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hq-bg-primary">
      <Navbar />
      <Sidebar links={ORGANISER_LINKS} title="Organiser Panel" />
      <main className="pl-60 pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
