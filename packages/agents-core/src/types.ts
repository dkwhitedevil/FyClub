export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface TreasuryPosition {
  token: string;
  balance: number;
  usdValue: number;
}

export interface TreasurySnapshot {
  address: string;
  totalUsdValue: number;
  positions: TreasuryPosition[];
}

export interface RiskResult {
  level: RiskLevel;
  score: number; // 0 - 100
  issues: string[];
}

export interface ProtectionAction {
  type: "ALERT" | "DIVERSIFY" | "REDUCE";
  message: string;
}

export interface ProtectionPlan {
  actions: ProtectionAction[];
}
