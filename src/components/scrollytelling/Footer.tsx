import React from "react";
import { ArrowRight, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const handleStartEarning = () => {
    // Implement direct navigation or modal logic here
    console.log("Navigating to Start Earning...");
  };

  const handleExploreEcosystem = () => {
    // Implement direct navigation or modal logic here
    console.log("Navigating to Explore Ecosystem...");
  };

  return (
    <footer className="w-full bg-[#05070D] z-20 relative pt-20">
      
      {/* Final CTA Strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-32">
        <div className="glass-card rounded-[2rem] p-12 md:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
           {/* Ambient gradient in background */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(110,168,255,0.08)] pointer-events-none" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[rgba(110,168,255,0.4)] to-transparent" />

           <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8 z-10 text-glow">
             Join the Future of<br className="hidden md:block" /> Internet Finance
           </h2>
           <p className="text-[rgba(255,255,255,0.6)] text-sm md:text-base max-w-xl mb-10 z-10">
             Get started with ALGO, or explore our ecosystem to build institutional-grade apps.
           </p>

           <div className="flex items-center gap-4 z-10">
              <button 
                type="button"
                onClick={handleStartEarning}
                className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
                aria-label="Start Earning on your ALGO"
              >
                Start Earning <ArrowRight size={16} className="inline ml-1" />
              </button>
              <Link 
                href="/ecosystem"
                className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[rgba(255,255,255,0.15)] transition-colors inline-block"
              >
                Explore Ecosystem
              </Link>
           </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 border-t border-[rgba(255,255,255,0.05)] pt-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
           
           <div className="col-span-2 md:col-span-2">
              <h3 className="text-2xl font-bold tracking-tighter uppercase text-glow mb-4">ALGORAND</h3>
              <p className="text-sm text-[rgba(255,255,255,0.4)] max-w-sm mb-6">
                 Digital dollars for the borderless economy.
              </p>
              <div className="flex gap-4 opacity-60">
                  <a 
                    href="https://twitter.com/algorand" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors" 
                    aria-label="Twitter — link opens in a new tab"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="https://github.com/algorand" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors" 
                    aria-label="GitHub — link opens in a new tab"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href="https://linkedin.com/company/algorand" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors" 
                    aria-label="LinkedIn — link opens in a new tab"
                  >
                    <Linkedin size={20} />
                  </a>
              </div>
           </div>

           <div>
              <h4 className="font-semibold text-sm tracking-wider mb-6">Ecosystem</h4>
              <ul className="flex flex-col gap-3 text-sm text-[rgba(255,255,255,0.5)]">
                 <li><Link href="#" className="hover:text-white transition-colors">DeFi</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Exchanges</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Wallets</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Institutional</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-semibold text-sm tracking-wider mb-6">Developers</h4>
              <ul className="flex flex-col gap-3 text-sm text-[rgba(255,255,255,0.5)]">
                 <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">GitHub</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Audits</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Bug Bounty</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-semibold text-sm tracking-wider mb-6">Company</h4>
              <ul className="flex flex-col gap-3 text-sm text-[rgba(255,255,255,0.5)]">
                 <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
           </div>

        </div>
      </div>
    </footer>
  );
}
