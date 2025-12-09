"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black text-pink-600 uppercase tracking-tighter">
              FY CLUB
            </h1>

          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="font-black uppercase text-xs tracking-widest hover:text-pink-600 transition"
            >
              Features
            </a>
            <a
              href="https://github.com/dkwhitedevil/FyClub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black uppercase text-xs tracking-widest hover:text-pink-600 transition"
            >
              GitHub
            </a>
            <Link href="/dashboard">
              <button className="border-4 border-black px-5 py-2 font-black uppercase text-xs bg-pink-500 hover:bg-pink-400 shadow-[4px_4px_0px_#000] transition">
                Launch App
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Content */}
          <div className="space-y-10">
            <div className="inline-block border-4 border-black px-5 py-1 font-black uppercase text-xs tracking-widest bg-pink-100">
              Autonomous DeFi Protection Agent
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[1.05] tracking-tight">
              AI Risk <br /> & Rebalancing <br /> For DeFi Treasuries
            </h1>

            <p className="text-sm md:text-base font-semibold text-pink-600 max-w-xl tracking-wide">
              The First Rule of DeFi Safety is Protection
            </p>

            <p className="text-lg font-semibold text-gray-700 max-w-xl leading-relaxed">
              Fight for You Club continuously monitors high-value DeFi treasury wallets,
              assigns real-time risk scores, and auto-generates protection actions
              using multi-agent AI governance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/dashboard">
                <button className="px-10 py-4 bg-pink-500 hover:bg-pink-400 border-4 border-black font-black uppercase shadow-[6px_6px_0px_#000] transition">
                  → Scan Treasury
                </button>
              </Link>

              <a
                href="https://github.com/dkwhitedevil/FyClub"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-white border-4 border-black font-black uppercase shadow-[6px_6px_0px_#000] hover:bg-gray-50 transition text-center"
              >
                → View Code
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center">
            <div className="relative w-[400px] h-[400px] border-4 border-black shadow-[10px_10px_0px_#000] bg-white flex items-center justify-center">
              <Image
                src="/logo1.png"
                alt="FY Club Logo"
                
                fill
                className="object-contain p-12"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-black uppercase text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {/* Feature 1 */}
            <div className="border-4 border-black p-10 shadow-[8px_8px_0px_#000] bg-white space-y-5">
              <div className="text-5xl font-black text-pink-500">01</div>
              <h3 className="font-black uppercase text-xl">
                Real-Time Monitoring
              </h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                Instantly fetches on-chain treasury balances and asset composition
                directly from live blockchain data.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-4 border-black p-10 shadow-[8px_8px_0px_#000] bg-white space-y-5">
              <div className="text-5xl font-black text-pink-500">02</div>
              <h3 className="font-black uppercase text-xl">
                AI Risk Analysis
              </h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                Multi-agent ADK-TS models evaluate exposure, liquidity risk,
                volatility, and concentration threats.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-4 border-black p-10 shadow-[8px_8px_0px_#000] bg-white space-y-5">
              <div className="text-5xl font-black text-pink-500">03</div>
              <h3 className="font-black uppercase text-xl">
                Protection Actions
              </h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                Automatically generates policy enforcement and treasury defense
                strategies using governance agents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

          <div>
            <h4 className="font-black uppercase text-lg mb-3">
              Built with ADK-TS
            </h4>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">
              FY Club uses IQAI’s Agent Development Kit for TypeScript to run
              decentralized risk governance and protection logic.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase text-lg mb-3">
              ATP Ready
            </h4>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">
              After submission, FY Club deploys as a fully autonomous on-chain
              agent on ATP.
            </p>
          </div>
        </div>

        <div className="border-t-4 border-black" />

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-between items-center gap-6">
          <p className="text-xs font-black uppercase text-gray-600">
            © 2025 FY Club • Agent Arena Hackathon
          </p>

          <div className="flex gap-8">
            <a
              href="https://github.com/dkwhitedevil/FyClub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black uppercase hover:text-pink-600 transition"
            >
              GitHub
            </a>
            
          </div>
        </div>
      </footer>

    </main>
  );
}
