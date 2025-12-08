import { LlmAgent } from "@iqai/adk";
import type { RiskResult, ProtectionPlan } from "../types.ts";

export const plannerAgent = new LlmAgent({
  name: "planner_agent",
  model: "gemini-2.5-flash",
  description: "Generates DeFi protection strategy",
  instruction: "You are a DeFi security strategist. Generate protection plans for treasury risks."
});

// Custom runner function for protection planning
export async function generateProtectionPlan(risk: RiskResult): Promise<ProtectionPlan> {
  const actions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }> = [];

  if (risk.level === "HIGH") {
    actions.push({
      type: "ALERT",
      message: "Immediate risk detected. Manual review required."
    });

    actions.push({
      type: "REDUCE",
      message: "Reduce high exposure positions immediately."
    });
  }

  if (risk.level === "MEDIUM") {
    actions.push({
      type: "DIVERSIFY",
      message: "Diversify treasury across multiple stable assets."
    });
  }

  if (risk.level === "LOW") {
    actions.push({
      type: "ALERT",
      message: "Treasury is currently stable."
    });
  }

  return { actions };
}
