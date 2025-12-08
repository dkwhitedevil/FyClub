import { AgentBuilder } from "@iqai/adk";
import type { TreasurySnapshot, RiskResult } from "../types.ts";

let riskRunner: any = null;

export async function initRiskAgent() {
  if (riskRunner) return;
  const built = await AgentBuilder.create("risk_agent")
    .withModel("gemini-2.5-flash")
    .withInstruction(`You are a professional DeFi risk analyst.\nGiven a TreasurySnapshot JSON object as input, evaluate concentration risk, size exposure and detect risky patterns.\nReturn STRICT JSON in this exact format:\n{\n  \"level\": \"LOW\" | \"MEDIUM\" | \"HIGH\",\n  \"score\": number,\n  \"issues\": string[]\n}`)
    .build();

  riskRunner = (built as any).runner;
}

// Custom runner function for risk analysis
export async function analyzeRisk(snapshot: TreasurySnapshot): Promise<RiskResult> {
  try {
    if (!riskRunner) throw new Error("riskRunner not initialized");
    const res = await riskRunner.ask(JSON.stringify(snapshot));
    const out = (res as any)?.output ?? res;

    if (typeof out === "string") {
      try {
        const parsed = JSON.parse(out) as RiskResult;
        return parsed;
      } catch (err) {
        // fallthrough
      }
    }

    if (typeof out === "object" && out !== null) {
      return out as RiskResult;
    }
  } catch (err) {
    console.warn("riskRunner.ask() failed, falling back to deterministic analyzer:", err);
  }

  // Deterministic fallback (previous heuristic)
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
