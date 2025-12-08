import { LlmAgent } from "@iqai/adk";
import type { RiskResult, ProtectionPlan } from "../types.ts";

export interface GovernanceDecision {
  approved: boolean;
  reason: string;
  enforcedActions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }>;
}

export const governanceAgent = new LlmAgent({
  name: "governance_agent",
  model: "gemini-2.5-flash",
  description: "Enforces treasury safety rules and governance policies",
  instruction: `You are the final safety authority for FY Club.
    Your job is to enforce strict security rules.
    You can block unsafe actions and approve only protective ones.`
});

// Custom runner function for governance enforcement
export async function enforceGovernance(
  input: {
    risk: RiskResult;
    plan: ProtectionPlan;
    totalUsdValue: number;
  }
): Promise<GovernanceDecision> {
  const { risk, plan, totalUsdValue } = input;

  // ✅ RULE 1: Block everything if risk is HIGH and treasury is huge
  if (risk.level === "HIGH" && totalUsdValue > 1_000_000) {
    return {
      approved: false,
      reason:
        "Critical risk on a large treasury. All automated actions are blocked. Manual intervention required.",
      enforcedActions: [
        {
          type: "ALERT",
          message: "Governance has blocked all automation due to critical risk."
        }
      ]
    };
  }

  // ✅ RULE 2: Allow only diversification for MEDIUM risk
  if (risk.level === "MEDIUM") {
    const safeActions = plan.actions.filter(
      (a: any) => a.type === "DIVERSIFY" || a.type === "ALERT"
    );

    return {
      approved: true,
      reason:
        "Moderate risk detected. Only safe diversification actions allowed.",
      enforcedActions: safeActions
    };
  }

  // ✅ RULE 3: LOW risk → approve everything
  if (risk.level === "LOW") {
    return {
      approved: true,
      reason: "Low risk treasury. All protection actions approved.",
      enforcedActions: plan.actions
    };
  }

  // ✅ FALLBACK SAFETY
  return {
    approved: false,
    reason: "Unrecognized risk state. Governance blocked execution.",
    enforcedActions: [
      {
        type: "ALERT",
        message: "Governance fallback activated. No automated actions allowed."
      }
    ]
  };
}
