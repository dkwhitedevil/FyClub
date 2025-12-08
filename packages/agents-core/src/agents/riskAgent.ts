import { LlmAgent } from "@iqai/adk";
import type { TreasurySnapshot, RiskResult } from "../types.ts";

export const riskAgent = new LlmAgent({
  name: "risk_agent",
  model: "gemini-2.5-flash",
  description: "Analyzes exposure and computes treasury risk",
  instruction: "You are a DeFi risk analyst. Analyze treasury exposure and return risk assessment."
});

// Custom runner function for risk analysis
export async function analyzeRisk(snapshot: TreasurySnapshot): Promise<RiskResult> {
  const issues: string[] = [];
  let score = 100;

  if (snapshot.totalUsdValue > 100000) {
    issues.push("Large treasury exposure detected.");
    score -= 25;
  }

  if (snapshot.positions.length === 1) {
    issues.push("Treasury fully concentrated in a single asset.");
    score -= 40;
  }

  let level: RiskResult["level"] = "LOW";
  if (score < 70) level = "MEDIUM";
  if (score < 40) level = "HIGH";

  return {
    level,
    score,
    issues
  };
}
