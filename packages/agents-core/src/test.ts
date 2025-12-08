import { watchTreasury } from "./agents/watcherAgent.ts";
import { analyzeRisk } from "./agents/riskAgent.ts";
import { generateProtectionPlan } from "./agents/plannerAgent.ts";
import { enforceGovernance } from "./agents/governanceAgent.ts";

// ✅ Use ANY public wallet (you do NOT need your own funds)
const TEST_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Ethereum whale

async function runFullTest() {
  console.log("\n==============================");
  console.log("🥊 FY CLUB — FULL AI FLOW TEST");
  console.log("==============================\n");

  try {
    // ✅ STEP 1: WATCHER → Read On-Chain Treasury
    console.log("🔍 STEP 1: Reading Treasury...");
    const snapshot = await watchTreasury(TEST_WALLET);

    console.log("✅ Treasury Snapshot:");
    console.log(JSON.stringify(snapshot, null, 2), "\n");

    // ✅ STEP 2: RISK AGENT → Analyze Risk
    console.log("📊 STEP 2: Analyzing Risk...");
    const risk = await analyzeRisk(snapshot);

    console.log("✅ Risk Analysis:");
    console.log(JSON.stringify(risk, null, 2), "\n");

    // ✅ STEP 3: PLANNER → Generate Protection Plan
    console.log("🛡️ STEP 3: Generating Protection Strategy...");
    const plan = await generateProtectionPlan(risk);

    console.log("✅ Protection Plan:");
    console.log(JSON.stringify(plan, null, 2), "\n");

    // ✅ STEP 4: GOVERNANCE → Final Approval / Block
    console.log("⚖️ STEP 4: Applying Governance Rules...");
    const governanceDecision = await enforceGovernance({
      risk,
      plan,
      totalUsdValue: snapshot.totalUsdValue
    });

    console.log("✅ Governance Decision:");
    console.log(JSON.stringify(governanceDecision, null, 2), "\n");

    // ✅ FINAL SUMMARY
    console.log("==============================");
    console.log("✅ FY CLUB FULL FLOW COMPLETE");
    console.log("==============================");

  } catch (error) {
    console.error("\n❌ FY CLUB TEST FAILED");
    console.error(error);
  }
}

// ✅ RUN THE TEST
runFullTest();
