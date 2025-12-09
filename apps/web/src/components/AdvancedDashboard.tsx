"use client";

import { useState } from "react";
import type { TreasuryScanResult } from "@/types/index";

type Props = {
  result: TreasuryScanResult | null;
  onScan: (address: string) => Promise<void>;
  loading: boolean;
};

export default function AdvancedDashboard({ result, onScan, loading }: Props) {
  const snapshot = result?.snapshot;
  const risk = result?.risk;
  const [exporting, setExporting] = useState(false);

  const fmt = (v: any) => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) return v.map((it) => (typeof it === "object" ? JSON.stringify(it) : String(it))).join(", ");
    try {
      return JSON.stringify(v);
    } catch (e) {
      return String(v);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Top: Overview + Actions */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card-brutalist lg:col-span-2 grid md:grid-cols-2 gap-8 items-start">
          <h2 className="text-2xl font-black mb-2 md:col-span-2">Advanced Treasury Overview</h2>
          <div className="space-y-4">

            <div>
              <p className="font-bold text-sm">Treasury Address</p>
              <p className="text-sm break-all">{snapshot?.address || "—"}</p>
            </div>

            <div>
              <p className="font-bold text-sm">Chain</p>
              <p className="text-sm">Ethereum</p>
            </div>

            <div>
              <p className="font-bold text-sm">Treasury Type</p>
              <p className="text-sm">DAO / Multisig</p>
            </div>

          </div>

          <div className="space-y-4">

            <div>
              <p className="font-bold text-sm">Total USD Value</p>
              <p className="text-4xl font-black mt-1">${(snapshot?.totalUsdValue ?? 0).toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-xs font-semibold">Positions</p>
                <p className="text-sm">{snapshot?.positions?.length ?? 0}</p>
              </div>
              <div>
                <p className="text-xs font-semibold">Status</p>
                <p className="text-sm">Active</p>
              </div>
              <div>
                <p className="text-xs font-semibold">Risk Level</p>
                <p className="text-sm font-bold">{risk?.level ?? "—"}</p>
              </div>
            </div>

          </div>

        </div>

        <div className="card-pink">
          <h3 className="font-black">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              className="btn-brutalist w-full disabled:opacity-50"
              onClick={async () => {
                if (!snapshot?.address) {
                  alert("No treasury address available to scan.");
                  return;
                }
                try {
                  await onScan(snapshot.address);
                } catch (err: any) {
                  console.error(err);
                  alert(err?.message || "Scan failed");
                }
              }}
              disabled={loading}
            >
              {loading ? "SCANNING..." : "Run Full AI Scan"}
            </button>

            <button
              className="btn-pink w-full"
              onClick={() => {
                // navigate to governance section
                try {
                  window.location.hash = "#governance";
                } catch (e) {
                  // fallback
                  const el = document.getElementById("governance");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Open Governance Panel
            </button>

            <button
              className="btn-brutalist w-full disabled:opacity-50"
              onClick={async () => {
                if (!result) {
                  alert("No scan result to export.");
                  return;
                }
                setExporting(true);
                try {
                  const data = JSON.stringify(result, null, 2);
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const filename = `fyclub-scan-${snapshot?.address ?? "unknown"}-${Date.now()}.json`;
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                  alert(`Exported ${filename}`);
                } catch (e) {
                  console.error(e);
                  alert("Export failed");
                } finally {
                  setExporting(false);
                }
              }}
              disabled={exporting}
            >
              {exporting ? "EXPORTING..." : "Export Report (JSON)"}
            </button>
          </div>
        </div>
      </section>

      {/* Holdings & Concentration */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card-brutalist">
          <h3 className="font-black mb-3">Detailed Asset Breakdown</h3>

          {snapshot?.positions?.length ? (
            <div className="space-y-4">
              {snapshot.positions.map((p: any, idx: number) => {
                const pct = ((p.usdValue / (snapshot?.totalUsdValue ?? 1)) * 100).toFixed(1);
                const balance = p.balance != null && !isNaN(Number(p.balance)) ? Number(p.balance).toFixed(2) : (p.balance ?? "—");
                const usd = p.usdValue != null && !isNaN(Number(p.usdValue)) ? Number(p.usdValue).toFixed(2) : "0.00";

                return (
                  <div key={idx} className="p-4 border-2 border-black flex justify-between items-center">
                    <div>
                      <div className="font-bold">{p.token}</div>
                      <div className="text-xs text-gray-600">Balance: <span className="font-mono">{balance}</span></div>
                    </div>

                    <div className="text-right">
                      <div className="font-black">${usd}</div>
                      <div className="text-xs text-gray-600">{pct}% of treasury</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No positions available</p>
          )}

        </div>

        <div className="card-brutalist">
          <h3 className="font-black mb-3">Concentration & Diversification</h3>
          <p className="mb-2">Total Positions: {snapshot?.positions?.length ?? 0}</p>
          <p className="mb-2">Largest Position: {snapshot?.positions?.[0]?.token ?? "—"}</p>
          <p className="mb-2">Diversification: {(snapshot?.positions?.length ?? 0) > 1 ? "Multi-Asset" : "Single-Asset"}</p>
          <p>Risk Assessment:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Primary Exposure: {snapshot?.positions?.[0]?.token ?? "—"}</li>
            <li>Position Count: {snapshot?.positions?.length ?? 0}</li>
          </ul>
        </div>

        <div className="card-brutalist">
          <h3 className="font-black mb-3">Risk Engine Output</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td>Risk Level</td><td className="text-right font-bold">{risk?.level ?? "—"}</td></tr>
              <tr><td>Risk Score</td><td className="text-right font-bold">{risk?.score ?? 0} / 100</td></tr>
              <tr><td>Issues Detected</td><td className="text-right">{risk?.issues?.length ?? 0}</td></tr>
            </tbody>
          </table>
          <div className="mt-4">
            <p className="text-xs font-semibold">Issues:</p>
            <ul className="list-disc pl-6 mt-2 text-xs">
              {risk?.issues?.length ? (
                risk.issues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))
              ) : (
                <li className="text-gray-600">No issues detected</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Volatility, Protocols, Protection Plan */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card-pink">
          <h4 className="font-black">Volatility & Risk Profile</h4>
          <p className="mt-2">Current Risk Level: {risk?.level ?? "—"}</p>
          <p>Risk Score: {risk?.score ?? 0} / 100</p>
          <div className="mt-3">
            <p className="font-semibold">Status</p>
            <p className="text-sm mt-2">{risk?.level === "LOW" ? "✅ Minimal Risk" : risk?.level === "MEDIUM" ? "⚠️ Moderate Risk" : "❌ High Risk"}</p>
          </div>
        </div>

        <div className="card-brutalist">
          <h4 className="font-black">Portfolio Assets</h4>
          {snapshot?.positions?.length ? (
            <ul className="list-disc pl-6 mt-2 text-sm">
              {snapshot.positions.map((p: any, i: number) => (
                <li key={i}>{p.token} — ${p.usdValue != null && !isNaN(Number(p.usdValue)) ? Number(p.usdValue).toFixed(2) : "0.00"}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No positions available</p>
          )}
        </div>

        <div className="card-brutalist">
          <h4 className="font-black">Protection Actions</h4>
          {result?.plan?.actions?.length ? (
            <ol className="list-decimal pl-6 mt-2 text-sm">
              {result.plan.actions.map((a: any, i: number) => (
                <li key={i} className="mb-2">
                  <div className="font-semibold">{fmt(a.type)}</div>
                  <div className="text-sm text-gray-700">{fmt(a.message)}</div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-600">No actions needed</p>
          )}
        </div>
      </section>

      {/* Governance, Actions, Timeline */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div id="governance" className="card-brutalist">
          <h4 className="font-black">Governance Status</h4>
          <p className="mt-2">Decision: {result?.governance?.approved ? "✅ Approved" : "❌ Not Approved"}</p>
          <p>Reason:</p>
          <p className="text-sm mt-2">
            {typeof result?.governance?.reason === "string"
              ? result.governance.reason
              : typeof result?.governance?.reason === "object"
                ? JSON.stringify(result.governance.reason)
                : "—"}
          </p>
        </div>

        <div className="card-brutalist">
          <h4 className="font-black">Enforced Actions</h4>
          <table className="w-full text-sm">
            <thead className="border-b-2 border-black">
              <tr className="text-xs font-bold">
                <th className="text-left py-2">Action</th>
                <th className="text-right py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {result?.governance?.enforcedActions?.length ? (
                result.governance.enforcedActions.map((a: any, idx: number) => (
                  <tr key={idx} className="align-middle">
                    <td className="py-2">{a.type}</td>
                    <td className="text-right py-2">
                      <span className="inline-flex items-center justify-end gap-2 text-green-600 font-semibold">✓ <span className="text-black font-medium">Enforced</span></span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={2} className="text-sm text-gray-600 py-2">No actions</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-brutalist">
          <h4 className="font-black">System Status</h4>
          <ol className="list-decimal pl-6 mt-2 text-sm">
            <li>Scan Completed ✓</li>
            <li>Risk Assessed ✓</li>
            <li>Plan Generated ✓</li>
            <li>Governance Approved: {result?.governance?.approved ? "✓" : "✗"}</li>
          </ol>
        </div>
      </section>

      {/* Agents & ATP */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card-brutalist">
          <h4 className="font-black">Agent Transparency Panel</h4>
          <ul className="list-disc pl-6 mt-2 text-sm">
            <li>Risk Agent: ADK-TS LLM + heuristics</li>
            <li>Planner Agent: Multi-objective optimizer</li>
            <li>Governance Agent: Policy-driven validator</li>
          </ul>
        </div>

        <div className="card-pink">
          <h4 className="font-black">ATP Agent Metadata</h4>
          <p className="mt-2">Agent: FY Club Treasury Guardian</p>
          <p>Type: ADK-TS Multi-Agent System</p>
          <p>Status: Production Ready</p>
        </div>
      </section>

      {/* Summary */}
      <section className="card-brutalist">
        <h4 className="font-black">Scan Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-bold">Treasury Address</p>
            <p className="text-sm">{snapshot?.address ?? "—"}</p>
          </div>
          <div>
            <p className="font-bold">Total Value</p>
            <p className="text-sm">${(snapshot?.totalUsdValue ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Positions</p>
            <p className="text-sm">{snapshot?.positions?.length ?? 0}</p>
          </div>
          <div>
            <p className="font-bold">Final Risk Score</p>
            <p className="text-sm">{risk?.score ?? 0} / 100</p>
          </div>
        </div>
      </section>
    </div>
  );
}
