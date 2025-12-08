import { watchTreasury } from "../agents/watcherAgent.ts";
import { analyzeRisk, initRiskAgent } from "../agents/riskAgent.ts";
import { generateProtectionPlan, initPlannerAgent } from "../agents/plannerAgent.ts";
import { enforceGovernance, initGovernanceAgent } from "../agents/governanceAgent.ts";

/**
 * Treasury Governance Workflow using ADK Agents
 * Orchestrates the complete on-chain treasury analysis and protection pipeline
 */

export async function runTreasuryWorkflow(address: string) {
  try {
    console.log("🚀 Starting Treasury Governance Workflow (ADK-driven)");

    // ✅ Initialize all ADK agents
    await initRiskAgent();
    await initPlannerAgent();
    await initGovernanceAgent();

    // 1. Watch Treasury (Real On-Chain Data)
    console.log("1️⃣  Reading on-chain treasury...");
    const snapshot = await watchTreasury(address);
    console.log("✅ Treasury snapshot acquired");

    // 2. Risk Analysis (ADK Agent)
    console.log("2️⃣  Analyzing risk with ADK Risk Agent...");
    const risk = await analyzeRisk(snapshot);
    console.log(`✅ Risk Level: ${risk.level} (Score: ${risk.score}/100)`);

    // 3. Protection Planning (ADK Agent)
    console.log("3️⃣  Generating protection plan with ADK Planner Agent...");
    const plan = await generateProtectionPlan(risk);
    console.log(`✅ Generated ${plan.actions.length} protection actions`);

    // 4. Governance Enforcement (ADK Agent)
    console.log("4️⃣  Enforcing governance with ADK Governance Agent...");
    const governance = await enforceGovernance({
      risk,
      plan,
      totalUsdValue: snapshot.totalUsdValue
    });
    console.log(`✅ Governance Decision: ${governance.approved ? "APPROVED" : "BLOCKED"}`);

    console.log("✅ Treasury Governance Workflow Complete (ADK Pipeline)\n");

    return {
      snapshot,
      risk,
      plan,
      governance
    };
  } catch (err) {
    console.error("❌ Workflow error:", err);

    // ✅ Emergency fallback (never breaks)
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
