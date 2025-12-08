"use client";

import { useState } from "react";

interface Props {
  onScan: (address: string) => void;
  loading: boolean;
}

export default function TreasuryScanForm({ onScan, loading }: Props) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    onScan(address.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="card-pink">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase">Scan Treasury</h2>
        {loading && (
          <span className="badge-pink animate-pulse">
            Running AI scan...
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-700">
            Treasury Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            disabled={loading}
            className="w-full text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-pink w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Scanning..." : "→ Run AI Risk Scan"}
        </button>
      </div>
    </form>
  );
}
