import "dotenv/config";
import { analyzeRisk } from "./agents/riskAgent.ts";
import { generateProtectionPlan } from "./agents/plannerAgent.ts";
import { enforceGovernance } from "./agents/governanceAgent.ts";
import { watchTreasury } from "./agents/watcherAgent.ts";

console.log("✅ Starting FY Club Treasury Governance Test\n");

const wallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const snapshot = await watchTreasury(wallet);
console.log("📊 TREASURY SNAPSHOT:", snapshot);
console.log();

const risk = await analyzeRisk(snapshot);
console.log("⚠️  RISK ANALYSIS:", risk);
console.log();

const plan = await generateProtectionPlan(risk);
console.log("📋 PROTECTION PLAN:", plan);
console.log();

const decision = await enforceGovernance({
  risk,
  plan,
  totalUsdValue: snapshot.totalUsdValue
});

console.log("✅ FINAL GOVERNANCE DECISION:", decision);
console.log("\n✅ Test completed successfully!");
