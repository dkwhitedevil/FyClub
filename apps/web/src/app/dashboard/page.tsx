"use client";

import { useState } from "react";
import Link from "next/link";
import { runRiskScan } from "@/lib/api";
import { TreasuryScanResult } from "@/types/index";
import AdvancedDashboard from "@/components/AdvancedDashboard";

export default function DashboardPage() {
  const [currentResult, setCurrentResult] = useState<TreasuryScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [history, setHistory] = useState<
    {
      address: string;
      timestamp: string;
      riskScore: number;
      riskLevel: string;
      result: TreasuryScanResult;
    }[]
  >([]);

  const performScan = async (scanAddress: string) => {
    setError(null);
    setLoading(true);

    try {
      const result = await runRiskScan(scanAddress);
      setCurrentResult(result);

      const entry = {
        address: result.snapshot?.address || scanAddress,
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

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a valid treasury address");
      return;
    }

    await performScan(address);
    setAddress("");
  };

  const handleSelectHistory = (entryIndex: number) => {
    const entry = history[entryIndex];
    if (entry) {
      setCurrentResult(entry.result);
      setError(null);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">

      {/* ✅ HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-black uppercase tracking-wide hover:text-pink-600 transition">
            ← FY CLUB
          </Link>

          <h1 className="font-black uppercase text-2xl tracking-wider">
            Treasury Risk Scanner
          </h1>

          <div className="w-[80px]" />
        </div>
      </header>

      {/* ✅ MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ✅ LEFT MAIN PANEL */}
          <div className="lg:col-span-3 flex flex-col gap-10">

            {/* ✅ SCAN FORM CARD */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-10">
              <h2 className="text-2xl font-black uppercase mb-8 tracking-wide">
                Scan Treasury Wallet
              </h2>

              <form onSubmit={handleScan} className="space-y-6">

                <div>
                  <label className="block text-sm font-black uppercase mb-2">
                    Treasury Address
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    disabled={loading}
                    className="w-full border-4 border-black px-5 py-4 text-sm font-mono bg-white outline-none focus:bg-pink-100 transition disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-pink-500 hover:bg-pink-400 border-4 border-black font-black uppercase tracking-wide transition disabled:opacity-50 shadow-[5px_5px_0px_#000]"
                >
                  {loading ? "Scanning Treasury..." : "Run Risk Scan"}
                </button>

              </form>

              {/* ✅ ERROR */}
              {error && (
                <div className="mt-6 bg-red-100 border-4 border-black p-4">
                  <p className="font-black text-sm text-red-700">❌ {error}</p>
                </div>
              )}
            </section>

            {/* ✅ RESULT PANEL */}
            {currentResult && !loading && (
              <div className="animate-in fade-in duration-300">
                <AdvancedDashboard
                  result={currentResult}
                  onScan={performScan}
                  loading={loading}
                />
              </div>
            )}

            {/* ✅ EMPTY STATE */}
            {!currentResult && !loading && (
              <div className="bg-gray-50 border-4 border-black p-14 text-center shadow-[8px_8px_0px_#000]">
                <h3 className="text-xl font-black uppercase mb-3">
                  Wallet Scanner Ready
                </h3>
                <p className="text-sm font-semibold text-gray-600 max-w-lg mx-auto">
                  Paste any on-chain treasury address to instantly evaluate its risk
                  exposure using autonomous AI agents.
                </p>
              </div>
            )}
          </div>

          {/* ✅ RIGHT SIDEBAR - HISTORY */}
          <aside className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000] sticky top-28 h-fit">

            <h3 className="text-lg font-black uppercase mb-5">
              Recent Wallet Scans
            </h3>

            {history.length === 0 ? (
              <p className="text-xs font-semibold text-gray-500">
                No scans yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">

                {history.map((entry, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectHistory(idx)}
                    className={`w-full text-left p-4 border-2 transition-all ${
                      currentResult?.snapshot?.address === entry.address
                        ? "border-pink-500 bg-pink-100"
                        : "border-black hover:border-pink-500 bg-white"
                    }`}
                  >
                    <p className="text-xs font-mono truncate">
                      {entry.address.slice(0, 12)}...{entry.address.slice(-10)}
                    </p>

                    <p
                      className={`text-xs font-black mt-1 ${
                        entry.riskLevel === "CRITICAL"
                          ? "text-red-600"
                          : entry.riskLevel === "HIGH"
                          ? "text-orange-600"
                          : entry.riskLevel === "MEDIUM"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {entry.riskLevel} • {entry.riskScore.toFixed(1)}%
                    </p>

                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>

        </div>
      </div>
    </main>
  );
}
