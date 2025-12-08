"use client";

import { useState } from "react";
import { runRiskScan } from "@/lib/api";
import type { TreasuryScanResult } from "@/types/index";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TreasuryScanForm from "@/components/TreasuryScanForm";
import SnapshotCard from "@/components/SnapshotCard";
import RiskSummaryCard from "@/components/RiskSummaryCard";
import PlanActionsCard from "@/components/PlanActionsCard";
import GovernanceCard from "@/components/GovernanceCard";
import ScanHistory from "@/components/ScanHistory";

export default function Page() {
  const [currentResult, setCurrentResult] = useState<TreasuryScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    {
      address: string;
      timestamp: string;
      riskScore: number;
      riskLevel: string;
      result: TreasuryScanResult;
    }[]
  >([]);

  const handleScan = async (address: string) => {
    setError(null);
    setLoading(true);

    try {
      const result = await runRiskScan(address);
      setCurrentResult(result);

      const entry = {
        address: result.snapshot?.address || address,
        timestamp: new Date().toISOString(),
        riskScore: result.risk.score,
        riskLevel: result.risk.level,
        result
      };

      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (e: any) {
      setError(e.message || "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (entryIndex: number) => {
    const entry = history[entryIndex];
    if (entry) {
      setCurrentResult(entry.result);
      setError(null);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-12">
        <Hero />

        <section id="scanner" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <TreasuryScanForm onScan={handleScan} loading={loading} />

              {error && (
                <div className="border-4 border-black bg-red-100 p-4">
                  <p className="font-bold text-red-900">❌ Error: {error}</p>
                </div>
              )}

              {currentResult && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <SnapshotCard snapshot={currentResult.snapshot!} />
                  <RiskSummaryCard risk={currentResult.risk} />
                  <PlanActionsCard plan={currentResult.plan} />
                  <GovernanceCard governance={currentResult.governance} />
                </div>
              )}

              {!currentResult && !loading && !error && (
                <div className="border-4 border-black bg-gray-50 p-8 text-center">
                  <p className="text-lg font-bold text-gray-700">
                    Enter a treasury address above to start the scan.
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-semibold">
                    FY Club will analyze its risk profile and generate protection recommendations.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <ScanHistory history={history} onSelect={handleSelectHistory} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t-4 border-black pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-black uppercase text-lg mb-3">Built with ADK-TS</h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                FY Club uses IQAI's Agent Development Kit for TypeScript to power its multi-agent AI system. Risk, Planner, and Governance agents work together to protect DeFi treasuries.
              </p>
            </div>
            <div>
              <h3 className="font-black uppercase text-lg mb-3">ATP Ready</h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                After submission, FY Club will be deployed on IQAI's Agent Tokenization Platform (ATP), becoming a live, autonomous agent protecting treasuries on-chain.
              </p>
            </div>
          </div>

          <div className="divider-brutalist" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase text-gray-600">
              © 2025 FY Club • AGENT ARENA Hackathon
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/dkwhitedevil/FyClub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase hover:underline underline-offset-4"
              >
                GitHub
              </a>
              <a
                href="https://discord.gg/UbQaZkznwr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase hover:underline underline-offset-4"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
