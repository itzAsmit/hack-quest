import React from "react";
import { ArrowRight, Lock, PieChart, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function TransparencySection() {
  // TODO: Replace these hardcoded metrics with live data from an API or central metrics service
  const protocolMetrics = {
    collateralized: "101.29%",
    feeBoundary: "<0.2%",
    security: "100%"
  };

  return (
    <section id="transparency" className="py-32 px-6 md:px-20 max-w-7xl mx-auto border-t border-[rgba(255,255,255,0.05)] bg-[#05070D] z-20 relative">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-widest text-[#6EA8FF] font-medium border border-[rgba(110,168,255,0.2)] bg-[rgba(110,168,255,0.05)] px-3 py-1 rounded-full mb-6 inline-block">
          INTEGRITY
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Unparalleled Transparency</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        
        {/* Card 1 */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><PieChart size={100} className="text-[#6EA8FF] translate-x-10 -translate-y-10" /></div>
          <div>
             <h3 className="text-xl font-medium mb-3">Real-Time Backing Assets</h3>
             <p className="text-[rgba(255,255,255,0.6)] text-sm mb-6 leading-relaxed">
               View real-time information about the allocation of backing assets.
             </p>
          </div>
          <Link 
            href="#" 
            className="flex items-center gap-2 text-xs text-[#6EA8FF] uppercase tracking-wider font-semibold hover:gap-3 transition-all"
            aria-label="Learn more about real-time backing assets"
          >
            LEARN MORE <ArrowRight size={14} />
          </Link>
        </div>

        {/* Card 2 */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Lock size={100} className="text-[#6EA8FF] translate-x-10 -translate-y-10" /></div>
           <div>
             <h3 className="text-xl font-medium mb-3">Provable Proof of Reserves</h3>
             <p className="text-[rgba(255,255,255,0.6)] text-sm mb-6 leading-relaxed">
               Independent third-party proofs of the value of the backing assets.
             </p>
          </div>
          <Link 
            href="#" 
            className="flex items-center gap-2 text-xs text-[#6EA8FF] uppercase tracking-wider font-semibold hover:gap-3 transition-all"
            aria-label="Learn more about proof of reserves"
          >
            LEARN MORE <ArrowRight size={14} />
          </Link>
        </div>

        {/* Card 3 */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><ShieldCheck size={100} className="text-[#6EA8FF] translate-x-10 -translate-y-10" /></div>
           <div>
             <h3 className="text-xl font-medium mb-3">Monthly Custodian Attestations</h3>
             <p className="text-[rgba(255,255,255,0.6)] text-sm mb-6 leading-relaxed">
               Independent attestations of the value of the backing assets resting with custodians.
             </p>
          </div>
          <Link 
            href="#" 
            className="flex items-center gap-2 text-xs text-[#6EA8FF] uppercase tracking-wider font-semibold hover:gap-3 transition-all"
            aria-label="Learn more about monthly attestations"
          >
            LEARN MORE <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="w-full flex-col md:flex-row flex justify-center items-center border-t border-[rgba(255,255,255,0.1)] pt-12 gap-16 md:gap-32 pointer-events-auto">
        <MetricCard 
          value={protocolMetrics.collateralized} 
          label="PROTOCOL COLLATERALIZED" 
          icon={<ShieldCheck size={14} className="text-[rgba(255,255,255,0.4)]"/>} 
        />
        <MetricCard 
          value={protocolMetrics.feeBoundary} 
          label="FEE BOUNDARY" 
          icon={<PieChart size={14} className="text-[rgba(255,255,255,0.4)]"/>}
        />
        <MetricCard 
          value={protocolMetrics.security} 
          label="OFF-EXCHANGE SECURITY" 
          icon={<Lock size={14} className="text-[rgba(255,255,255,0.4)]"/>} 
        />
      </div>

    </section>
  );
}

function MetricCard({ value, label, icon }: { value: string, label: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center group">
      <span className="text-4xl md:text-5xl font-semibold text-white mb-3 group-hover:text-glow transition-all duration-500">{value}</span>
      <span className="flex items-center gap-2 text-[10px] md:text-xs text-[rgba(255,255,255,0.5)] font-medium tracking-wider">{icon}{label}</span>
    </div>
  );
}
