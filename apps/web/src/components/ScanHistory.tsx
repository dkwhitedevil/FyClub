"use client";

import { formatAddress, formatTime } from "@/lib/api";
import type { TreasuryScanResult } from "@/types/index";

interface HistoryEntry {
  address: string;
  timestamp: string;
  riskScore: number;
  riskLevel: string;
  result: TreasuryScanResult;
}

interface Props {
  history: HistoryEntry[];
  onSelect: (index: number) => void;
}

function getRiskColor(level: string) {
  if (level === "LOW") return "bg-green-300";
  if (level === "MEDIUM") return "bg-yellow-300";
  return "bg-red-300";
}

export default function ScanHistory({ history, onSelect }: Props) {
  return (
    <div className="card-pink h-fit sticky top-6 space-y-4">
      <h3 className="text-2xl font-black uppercase">Recent Scans</h3>

      <div className="divider-brutalist" />

      {history.length === 0 ? (
        <p className="text-sm font-bold text-gray-700">
          Scans will appear here as you run them.
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((entry, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className="w-full border-2 border-black bg-white p-3 text-left hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black text-xs truncate" title={entry.address}>
                    {formatAddress(entry.address)}
                  </p>
                  <p className="text-[10px] text-gray-700 font-semibold">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
                <div className={`border-2 border-black ${getRiskColor(entry.riskLevel)} px-2 py-1 whitespace-nowrap font-black text-[10px]`}>
                  {entry.riskLevel}
                </div>
              </div>
              <p className="text-xs font-bold text-gray-800 mt-2">
                Score: {entry.riskScore}/100
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
