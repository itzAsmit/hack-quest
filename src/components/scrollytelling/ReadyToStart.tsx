import React from "react";
import { ArrowRight, Wallet, ArrowDownUp, CheckCircle, ChevronDown, Check } from "lucide-react";

export function ReadyToStart() {
  return (
    <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto border-t border-[rgba(255,255,255,0.05)] bg-[#05070D] z-20 relative">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-widest text-[#6EA8FF] font-medium border border-[rgba(110,168,255,0.2)] bg-[rgba(110,168,255,0.05)] px-3 py-1 rounded-full mb-6 inline-block">
          USE CASES

        </span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Ready to Start?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: DeFi */}
        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-center w-full mb-6 relative">
            <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-widest font-mono">01 \\ DEFI</span>
            <div className="bg-[rgba(255,255,255,0.05)] p-2 rounded-full"><Wallet size={16} className="text-[#6EA8FF]"/></div>
          </div>
          <h3 className="text-2xl font-medium mb-4">DeFi</h3>
          <ul className="flex flex-col gap-3 mb-10 text-sm text-[rgba(255,255,255,0.7)] flex-1 w-full border-b border-[rgba(255,255,255,0.05)] pb-8">
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> Earn on your savings with sALGO</li>
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> Use sALGO in other applications</li>
          </ul>

          <div className="w-full flex flex-col gap-3 opacity-60 pointer-events-none">
             {/* Fake partners listing */}
             <div className="flex items-center justify-between text-xs"><span>Folks Finance</span><ChevronDown size={12}/></div>
             <div className="flex items-center justify-between text-xs"><span>Tinyman</span><ChevronDown size={12}/></div>
             <div className="flex items-center justify-between text-xs"><span>Pact</span><ChevronDown size={12}/></div>
          </div>
        </div>

        {/* Card 2: Exchanges */}
        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:scale-[1.02] transition-transform duration-300 border-[rgba(110,168,255,0.2)] shadow-[0_0_30px_inset_rgba(110,168,255,0.05)]">
          <div className="flex justify-between items-center w-full mb-6 relative">
             <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-widest font-mono">02 \\ TRADING</span>
            <div className="bg-[rgba(255,255,255,0.05)] p-2 rounded-full"><ArrowDownUp size={16} className="text-[#6EA8FF]"/></div>
          </div>
          <h3 className="text-2xl font-medium mb-4">Exchanges</h3>
          <ul className="flex flex-col gap-3 mb-10 text-sm text-[rgba(255,255,255,0.7)] flex-1 w-full border-b border-[rgba(255,255,255,0.05)] pb-8">
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> 100x leverage on Bybit</li>
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> Engage in positive sum programs</li>
          </ul>
          
          <div className="w-full flex flex-col gap-3 opacity-60 pointer-events-none">
             <div className="flex items-center justify-between text-xs"><span>Binance</span><ChevronDown size={12}/></div>
             <div className="flex items-center justify-between text-xs"><span>Bybit</span><ChevronDown size={12}/></div>
             <div className="flex items-center justify-between text-xs"><span>Coinbase</span><ChevronDown size={12}/></div>
          </div>
        </div>

        {/* Card 3: Institutional */}
        <div className="glass-card rounded-2xl p-8 flex flex-col items-start hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-center w-full mb-6 relative">
            <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-widest font-mono">03 \\ INSTITUTION</span>
            <div className="bg-[rgba(255,255,255,0.05)] p-2 rounded-full"><CheckCircle size={16} className="text-[#6EA8FF]"/></div>
          </div>
          <h3 className="text-2xl font-medium mb-4">Institutional</h3>
          <ul className="flex flex-col gap-3 mb-10 text-sm text-[rgba(255,255,255,0.7)] flex-1 w-full border-b border-[rgba(255,255,255,0.05)] pb-8">
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> OTC access for regulated funds</li>
             <li className="flex items-start gap-2"><Check size={16} className="text-[#6EA8FF] shrink-0 mt-0.5" /> KYC & AML process for high net-worth entities</li>
          </ul>

          <div className="w-full flex flex-col gap-3 opacity-60 pointer-events-none">
             <div className="flex items-center justify-between text-xs"><span>Fidelity</span><span className="px-2 py-[2px] rounded-full border border-white/10 text-[9px]">Coming Soon</span></div>
             <div className="flex items-center justify-between text-xs"><span>Jane Street</span><span className="px-2 py-[2px] rounded-full border border-white/10 text-[9px]">Coming Soon</span></div>
             <div className="flex items-center justify-between text-xs"><span>Wintermute</span><span className="px-2 py-[2px] rounded-full border border-white/10 text-[9px]">Coming Soon</span></div>
          </div>
        </div>

      </div>
    </section>
  );
}
