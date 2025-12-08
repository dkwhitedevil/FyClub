import { watchTreasury } from "../agents/watcherAgent.ts";
import { analyzeRisk } from "../agents/riskAgent.ts";
import { generateProtectionPlan } from "../agents/plannerAgent.ts";
import { enforceGovernance } from "../agents/governanceAgent.ts";

export async function runTreasuryWorkflow(address: string) {
  const snapshot = await watchTreasury(address);
  const risk = await analyzeRisk(snapshot);
  const plan = await generateProtectionPlan(risk);
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
}
