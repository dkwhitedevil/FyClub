import { watchTreasury } from "../agents/watcherAgent.ts";
import { analyzeRisk } from "../agents/riskAgent.ts";
import { generateProtectionPlan } from "../agents/plannerAgent.ts";
import { enforceGovernance } from "../agents/governanceAgent.ts";

export async function runTreasuryWorkflow(address: string) {
  try {
    // 1. Read real on-chain treasury
    const snapshot = await watchTreasury(address);

    // 2. AI / fallback risk analysis
    const risk = await analyzeRisk(snapshot);

    // 3. AI / fallback protection planning
    const plan = await generateProtectionPlan(risk);

    // 4. Final AI / rule-based governance enforcement
    const governance = await enforceGovernance({
      risk,
      plan,
      totalUsdValue: snapshot.totalUsdValue
    });

    return {
      snapshot,
      risk,
      plan,
      governance
    };
  } catch (err) {
    console.error("Treasury workflow failed:", err);

    // ✅ Safe emergency fallback (never breaks UI/backend)
    return {
      snapshot: null,
      risk: {
        level: "HIGH",
        score: 0,
        issues: ["System failure during treasury analysis"]
      },
      plan: {
        actions: [
          {
            type: "ALERT",
            message: "Emergency mode: treasury analysis unavailable."
          }
        ]
      },
      governance: {
        approved: false,
        reason: "Emergency shutdown due to system failure.",
        enforcedActions: [
          {
            type: "ALERT",
            message: "Automation disabled due to internal error."
          }
        ]
      }
    };
  }
}
