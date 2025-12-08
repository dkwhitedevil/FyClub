import { AgentBuilder } from "@iqai/adk";
import type { RiskResult, ProtectionPlan } from "../types.ts";

export interface GovernanceDecision {
  approved: boolean;
  reason: string;
  enforcedActions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }>;
}

let governanceRunner: any = null;

export async function initGovernanceAgent() {
  if (governanceRunner) return;
  const built = await AgentBuilder.create("governance_agent")
    .withModel("gemini-2.5-flash")
    .withInstruction(`You are the final safety authority for FY Club.\nYour job is to enforce strict security rules.\nYou can block unsafe actions and approve only protective ones.\nReturn STRICT JSON:{ approved: boolean, reason: string, enforcedActions: [{type: 'ALERT'|'REDUCE'|'DIVERSIFY', message: string}]}`)
    .build();

  governanceRunner = (built as any).runner;
}

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
  // Otherwise, prefer LLM governor but enforce safety checks and validate output
  try {
    if (!governanceRunner) throw new Error("governanceRunner not initialized");
    const res = await governanceRunner.ask(JSON.stringify(input));
    const out = (res as any)?.output ?? res;

    let decision: GovernanceDecision | null = null;

    if (typeof out === "string") {
      try {
        decision = JSON.parse(out) as GovernanceDecision;
      } catch (err) {
        // continue to try object form
      }
    }

    if (!decision && typeof out === "object" && out !== null) {
      decision = out as GovernanceDecision;
    }

    // Validate/normalize decision
    if (decision) {
      const normalizedActions = (decision.enforcedActions || []).map((a: any) => ({
        type: a.type === "REDUCE" || a.type === "DIVERSIFY" ? a.type : "ALERT",
        message: String(a.message ?? "")
      }));

      return {
        approved: Boolean(decision.approved),
        reason: String(decision.reason ?? "No reason provided"),
        enforcedActions: normalizedActions
      };
    }
  } catch (err) {
    console.warn("governanceRunner.ask() failed, falling back to local governance rules:", err);
  }

  // Local deterministic governance fallback (safe defaults)
  if (risk.level === "MEDIUM") {
    const safeActions = plan.actions.filter((a: any) => a.type === "DIVERSIFY" || a.type === "ALERT");

    return {
      approved: true,
      reason: "Moderate risk detected. Only safe diversification actions allowed.",
      enforcedActions: safeActions
    };
  }

  if (risk.level === "LOW") {
    return {
      approved: true,
      reason: "Low risk treasury. All protection actions approved.",
      enforcedActions: plan.actions
    };
  }

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
