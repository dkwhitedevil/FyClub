export interface SnapshotPosition {
  token: string;
  balance: number;
  usdValue: number;
}

export interface Snapshot {
  address: string;
  totalUsdValue: number;
  positions: SnapshotPosition[];
}

export interface Risk {
  level: "LOW" | "MEDIUM" | "HIGH" | string;
  score: number;
  issues: string[];
}

export interface PlanAction {
  type: string;
  message: string;
}

export interface Plan {
  actions: PlanAction[];
}

export interface GovernanceAction {
  type: string;
  message: string;
}

export interface Governance {
  approved: boolean;
  reason: string;
  enforcedActions: GovernanceAction[];
}

export interface TreasuryScanResult {
  snapshot: Snapshot | null;
  risk: Risk;
  plan: Plan;
  governance: Governance;
}
