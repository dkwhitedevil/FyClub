import type { Governance } from "@/types/index";

interface Props {
  governance: Governance;
}

export default function GovernanceCard({ governance }: Props) {
  const isApproved = governance.approved;

  return (
    <div className="card-brutalist space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase">Governance Decision</h3>
        <div
          className={`border-4 px-4 py-2 font-black uppercase text-sm ${
            isApproved
              ? "border-black bg-green-300"
              : "border-black bg-red-300"
          }`}
        >
          {isApproved ? "✅ APPROVED" : "❌ BLOCKED"}
        </div>
      </div>

      <div className="divider-brutalist" />

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
          Decision Reason
        </p>
        <p className="font-semibold text-gray-900 leading-relaxed">
          {governance.reason}
        </p>
      </div>

      {governance.enforcedActions.length > 0 && (
        <>
          <div className="divider-brutalist" />

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">
              Enforced Actions ({governance.enforcedActions.length})
            </p>

            <div className="space-y-3">
              {governance.enforcedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="border-2 border-black bg-pink-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="border-2 border-black bg-pink-500 text-white px-2 py-1 font-black uppercase text-xs min-w-fit">
                      {action.type}
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {action.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="divider-brutalist" />

      <div className="bg-black text-white border-2 border-black p-4">
        <p className="text-xs font-black uppercase tracking-widest mb-2">
          ⚡ ADK-TS Powered
        </p>
        <p className="text-sm font-bold">
          This decision was made by FY Club's multi-agent AI system using IQAI's Agent Development Kit.
        </p>
      </div>
    </div>
  );
}
