import type { Risk } from "@/types/index";

interface Props {
  risk: Risk;
}

function getRiskBadge(level: string) {
  if (level === "LOW") return "bg-green-300 border-black";
  if (level === "MEDIUM") return "bg-yellow-300 border-black";
  return "bg-red-300 border-black";
}

function getRiskLabel(level: string) {
  if (level === "LOW") return "✅ LOW RISK";
  if (level === "MEDIUM") return "⚠️ MEDIUM RISK";
  return "🔴 HIGH RISK";
}

export default function RiskSummaryCard({ risk }: Props) {
  return (
    <div className="card-brutalist space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase">Risk Assessment</h3>
        <div className={`border-4 ${getRiskBadge(risk.level)} px-4 py-2 font-black uppercase text-sm`}>
          {getRiskLabel(risk.level)}
        </div>
      </div>

      <div className="divider-brutalist" />

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">
          Risk Score
        </p>
        <div className="flex items-baseline gap-3">
          <p className="text-5xl font-black text-black">{risk.score}</p>
          <p className="text-lg font-bold text-gray-700">/ 100</p>
        </div>
        <div className="mt-4 h-3 border-2 border-black bg-white">
          <div
            className={`h-full ${risk.score < 40 ? "bg-red-300" : risk.score < 70 ? "bg-yellow-300" : "bg-green-300"}`}
            style={{ width: `${Math.min(100, risk.score)}%` }}
          />
        </div>
      </div>

      <div className="divider-brutalist" />

      {risk.issues && risk.issues.length > 0 ? (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">
            Issues Detected ({risk.issues.length})
          </p>
          <div className="space-y-2">
            {risk.issues.map((issue, idx) => (
              <div
                key={idx}
                className="border-2 border-black bg-red-50 p-3 text-sm font-semibold text-gray-900"
              >
                • {issue}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm font-bold text-green-700 bg-green-50 border-2 border-black p-3">
          ✅ No major issues detected. Treasury within safe parameters.
        </p>
      )}
    </div>
  );
}
