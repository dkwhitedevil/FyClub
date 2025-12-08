import { AgentBuilder } from "@iqai/adk";
import type { TreasurySnapshot, RiskResult } from "../types.ts";
import { callQwenLLM, extractJSON, treasuryTools } from "../tools/treasuryTools.ts";

/**
 * Risk Analysis Agent using ADK
 * Evaluates DeFi treasury risk using LLM + deterministic fallbacks
 */

let riskAgent: any = null;
let riskRunner: any = null;

export async function initRiskAgent() {
  if (riskAgent && riskRunner) return;

  // ✅ Build agent using ADK AgentBuilder
  const built = await AgentBuilder.create("risk_analysis_agent")
    .withModel("qwen2.5")
    .withInstruction(
      `You are a professional DeFi risk analyst agent.
Analyze the treasury snapshot and provide a risk assessment.
Consider concentration risk, asset diversification, and treasury size.
Return STRICT JSON ONLY:
{
  "level": "LOW" | "MEDIUM" | "HIGH",
  "score": number (0-100),
  "issues": string[]
}`
    )
    .build();

  riskAgent = built;
  riskRunner = (built as any).runner;
  console.log("✅ Risk Agent initialized (ADK AgentBuilder)");
}

export async function analyzeRisk(snapshot: TreasurySnapshot): Promise<RiskResult> {
  try {
    // Ensure agent is initialized
    if (!riskRunner) {
      await initRiskAgent();
    }

    // ✅ Use ADK runner to invoke LLM with clear risk analysis prompt
    const positionCount = snapshot.positions.length;
    const avgPositionSize = snapshot.totalUsdValue / Math.max(1, positionCount);
    
    const prompt = `TASK: Analyze treasury concentration and risk level.

TREASURY METRICS:
- Total USD Value: $${snapshot.totalUsdValue.toFixed(2)}
- Number of positions: ${positionCount}
- Assets held: ${snapshot.positions.map((p) => `${p.token}`).join(", ")}
- Average position size: $${avgPositionSize.toFixed(2)}

RISK ANALYSIS FRAMEWORK:
1. CONCENTRATION RISK: 1 position = 40 points, 2-3 = 20 points, 4+ = 0 points
2. ASSET DIVERSIFICATION: All same token = 25 points, mixed = 0 points
3. SIZE IMPACT: >$10M = 30 points, $1-10M = 25 points, <$1M = 5 points
4. Total score = 100 - (points from above). Score > 70 = LOW risk, 40-70 = MEDIUM, <40 = HIGH

OUTPUT ONLY THIS JSON:
{"level":"LOW"|"MEDIUM"|"HIGH","score":0-100,"issues":["specific risk found"]}`;

    const response = await callQwenLLM(prompt);
    console.log("[DEBUG] Raw LLM response:", response);

    const parsed = extractJSON<RiskResult>(response);

    // Validate structure
    if (
      parsed.level &&
      ["LOW", "MEDIUM", "HIGH"].includes(parsed.level) &&
      typeof parsed.score === "number" &&
      Array.isArray(parsed.issues)
    ) {
      console.log("✅ Risk assessment from LLM");
      return parsed;
    }
  } catch (err) {
    console.warn("⚠️ LLM risk analysis failed, using deterministic fallback:", err);
  }

  // ✅ ADK-style deterministic fallback
  const baseRisk = treasuryTools.generateBaseRisk(snapshot);
  console.log("✅ Risk assessment from deterministic tool");
  return baseRisk;
}

