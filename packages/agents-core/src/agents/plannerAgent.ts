import { AgentBuilder } from "@iqai/adk";
import type { RiskResult, ProtectionPlan } from "../types.ts";

let plannerRunner: any = null;

export async function initPlannerAgent() {
  if (plannerRunner) return;
  const built = await AgentBuilder.create("planner_agent")
    .withModel("gemini-2.5-flash")
    .withInstruction(`You are a DeFi treasury strategist.\nBased on the given RiskResult, create a protection plan using only ALERT, REDUCE, or DIVERSIFY. Return STRICT JSON:\n{\n  \"actions\": [ { \"type\": \"ALERT\" | \"REDUCE\" | \"DIVERSIFY\", \"message\": string } ]\n}`)
    .build();

  plannerRunner = (built as any).runner;
}

export async function generateProtectionPlan(risk: RiskResult): Promise<ProtectionPlan> {
  try {
    if (!plannerRunner) throw new Error("plannerRunner not initialized");
    const res = await plannerRunner.ask(JSON.stringify(risk));
    const out = (res as any)?.output ?? res;

    if (typeof out === "string") {
      try {
        const parsed = JSON.parse(out) as ProtectionPlan;
        return parsed;
      } catch (err) {
        // fallthrough
      }
    }

    if (typeof out === "object" && out !== null) {
      return out as ProtectionPlan;
    }
  } catch (err) {
    console.warn("plannerRunner.ask() failed, falling back to deterministic planner:", err);
  }

  // Deterministic fallback
  const actions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }> = [];

  if (risk.level === "HIGH") {
    actions.push({ type: "ALERT", message: "Immediate risk detected. Manual review required." });
    actions.push({ type: "REDUCE", message: "Reduce high exposure positions immediately." });
  }

  if (risk.level === "MEDIUM") {
    actions.push({ type: "DIVERSIFY", message: "Diversify treasury across multiple stable assets." });
  }

  if (risk.level === "LOW") {
    actions.push({ type: "ALERT", message: "Treasury is currently stable." });
  }

  return { actions };
}
