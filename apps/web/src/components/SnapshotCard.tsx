import type { Snapshot } from "@/types/index";
import { formatAddress, formatCurrency } from "@/lib/api";

interface Props {
  snapshot: Snapshot;
}

export default function SnapshotCard({ snapshot }: Props) {
  return (
    <div className="card-brutalist space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
          Treasury Address
        </p>
        <p className="font-mono text-sm font-bold text-gray-800 break-all">
          {snapshot.address}
        </p>
      </div>

      <div className="divider-brutalist" />

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">
          Total Value
        </p>
        <p className="text-4xl font-black text-pink-600">
          {formatCurrency(snapshot.totalUsdValue)}
        </p>
      </div>

      <div className="divider-brutalist" />

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">
          Positions ({snapshot.positions.length})
        </p>
        <div className="space-y-3">
          {snapshot.positions.map((position, idx) => (
            <div
              key={idx}
              className="border-2 border-black bg-pink-50 p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-black">
                  {position.token}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  {position.balance.toFixed(6)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-pink-600">
                  {formatCurrency(position.usdValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
