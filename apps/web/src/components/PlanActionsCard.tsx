import type { Plan } from "@/types/index";

interface Props {
  plan: Plan;
}

function getActionBgColor(type: string) {
  if (type === "ALERT") return "bg-red-100 border-black";
  if (type === "REDUCE") return "bg-orange-100 border-black";
  if (type === "DIVERSIFY") return "bg-blue-100 border-black";
  return "bg-gray-100 border-black";
}

function getActionBadgeColor(type: string) {
  if (type === "ALERT") return "bg-red-500 text-white";
  if (type === "REDUCE") return "bg-orange-500 text-white";
  if (type === "DIVERSIFY") return "bg-blue-500 text-white";
  return "bg-gray-500 text-white";
}

export default function PlanActionsCard({ plan }: Props) {
  return (
    <div className="card-brutalist space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase">AI Protection Plan</h3>
        <div className="badge-pink">
          {plan.actions.length} Action{plan.actions.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="divider-brutalist" />

      {plan.actions.length === 0 ? (
        <p className="text-sm font-bold text-green-700 bg-green-50 border-2 border-black p-3">
          ✅ No immediate actions needed. Treasury is stable.
        </p>
      ) : (
        <div className="space-y-3">
          {plan.actions.map((action, idx) => (
            <div key={idx} className={`border-4 ${getActionBgColor(action.type)} p-4`}>
              <div className="flex items-start gap-3">
                <div
                  className={`border-2 border-black ${getActionBadgeColor(action.type)} px-3 py-1 font-black uppercase text-xs min-w-fit`}
                >
                  {action.type}
                </div>
                <p className="text-sm font-bold text-gray-900 leading-relaxed">{action.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
