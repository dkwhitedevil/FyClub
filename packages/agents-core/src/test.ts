import "dotenv/config"; 
import { initRiskAgent, analyzeRisk } from "./agents/riskAgent.ts";
import { initPlannerAgent, generateProtectionPlan } from "./agents/plannerAgent.ts";
import { initGovernanceAgent, enforceGovernance } from "./agents/governanceAgent.ts";
import { watchTreasury } from "./agents/watcherAgent.ts";

await initRiskAgent();
await initPlannerAgent();
await initGovernanceAgent();

const wallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const snapshot = await watchTreasury(wallet);
console.log("TREASURY:", snapshot);

const risk = await analyzeRisk(snapshot);
console.log("RISK:", risk);

const plan = await generateProtectionPlan(risk);
console.log("PLAN:", plan);

const decision = await enforceGovernance({
  risk,
  plan,
  totalUsdValue: snapshot.totalUsdValue
});

console.log("FINAL GOVERNANCE DECISION:", decision);
