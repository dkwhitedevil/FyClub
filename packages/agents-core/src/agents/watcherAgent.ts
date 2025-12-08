import { LlmAgent } from "@iqai/adk";
import { ethers } from "ethers";
import type { TreasurySnapshot } from "../types.ts";

// Use a free public RPC endpoint (no auth required)
const RPC_URL = process.env.RPC_URL || "https://eth.llamarpc.com"; // Updated to public endpoint

export const watcherAgent = new LlmAgent({
  name: "watcher_agent",
  model: "gemini-2.5-flash",
  description: "Reads real on-chain treasury balances",
  instruction: "You are a blockchain observer. Read treasury balances and return structured data."
});

// Custom runner function for watcher
export async function watchTreasury(address: string): Promise<TreasurySnapshot> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const balanceWei = await provider.getBalance(address);
  const balanceEth = Number(ethers.formatEther(balanceWei));
  const ethPrice = 3500; // Current approximate ETH price in USD

  const snapshot: TreasurySnapshot = {
    address: address,
    totalUsdValue: balanceEth * ethPrice,
    positions: [
      {
        token: "ETH",
        balance: balanceEth,
        usdValue: balanceEth * ethPrice
      }
    ]
  };

  return snapshot;
}
