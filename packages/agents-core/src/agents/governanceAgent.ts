import type { RiskResult, ProtectionPlan } from "../types.ts";

export interface GovernanceDecision {
  approved: boolean;
  reason: string;
  enforcedActions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }>;
}

/**
 * Safe universal Qwen Ollama caller
 * Handles all response formats
 */
async function callLocalLLM(prompt: string): Promise<string> {
  const res = await fetch("https://ollama-qwen.zeabur.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5:0.5b",
      prompt,
      stream: false
    })
  });

  const data = await res.json();

  // ✅ UNIVERSAL RESPONSE EXTRACTION (SUPPORTS ALL OLLAMA FORMATS)
  if (typeof data.response === "string") {
    return data.response;
  }

  if (data.message?.content && typeof data.message.content === "string") {
    return data.message.content;
  }

  if (typeof data === "string") {
    return data;
  }

  console.error("⚠️ Unexpected Qwen response format:", data);
  throw new Error("Invalid Qwen response format");
}

/**
 * Extract JSON from markdown-wrapped or text-surrounded JSON
 * Handles: ```json {...} ```, raw {...}, and text with embedded JSON
 */
function extractJson(text: string): any {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI output");
  }

  const jsonString = cleaned.slice(start, end + 1);
  return JSON.parse(jsonString);
}

/**
 * Strong validation against malformed AI output
 */
function isValidGovernanceDecision(obj: any): obj is GovernanceDecision {
  return (
    obj &&
    typeof obj.approved === "boolean" &&
    typeof obj.reason === "string" &&
    Array.isArray(obj.enforcedActions) &&
    obj.enforcedActions.every(
      (a: any) =>
        a &&
        (a.type === "ALERT" || a.type === "REDUCE" || a.type === "DIVERSIFY") &&
        typeof a.message === "string"
    )
  );
}

// ✅ MAIN GOVERNANCE ENFORCER (NOW FULLY LOCAL + UNLIMITED)
export async function enforceGovernance(
  input: {
    risk: RiskResult;
    plan: ProtectionPlan;
    totalUsdValue: number;
  }
): Promise<GovernanceDecision> {
  const { risk, plan, totalUsdValue } = input;

  // ✅ HARD RULE 1: Absolute block for huge high-risk treasury
  if (risk.level === "HIGH" && totalUsdValue > 1_000_000) {
    return {
      approved: false,
      reason:
        "Critical risk on a large treasury. All automated actions are blocked. Manual intervention required.",
      enforcedActions: [
        {
          type: "ALERT",
          message: "Governance has blocked all automation due to critical risk."
        }
      ]
    };
  }

  // ✅ OTHERWISE: USE YOUR QWEN GOVERNANCE AI
  try {
    const prompt = `
You are the final safety authority for FY Club.

Your job:
- Enforce strict treasury security rules
- Block unsafe actions
- Approve only protective ones

⚠️ YOU MUST RETURN STRICT JSON ONLY in this exact format:

{
  "approved": boolean,
  "reason": string,
  "enforcedActions": [
    { "type": "ALERT" | "REDUCE" | "DIVERSIFY", "message": string }
  ]
}

INPUT:
${JSON.stringify(input, null, 2)}
`;

    const out = await callLocalLLM(prompt);

    // ✅ SAFETY GUARD: Validate output before JSON.parse
    if (!out || typeof out !== "string") {
      throw new Error("Empty AI output");
    }

    const trimmed = out.trim();

    const parsed = extractJson(trimmed);

    if (isValidGovernanceDecision(parsed)) {
      // ✅ Normalize actions for extra safety
      const normalizedActions: GovernanceDecision["enforcedActions"] =
  parsed.enforcedActions.map((a) => {
    let safeType: "ALERT" | "REDUCE" | "DIVERSIFY" = "ALERT";

    if (a.type === "REDUCE") safeType = "REDUCE";
    else if (a.type === "DIVERSIFY") safeType = "DIVERSIFY";

    return {
      type: safeType,
      message: String(a.message)
    };
  });


      return {
        approved: Boolean(parsed.approved),
        reason: String(parsed.reason),
        enforcedActions: normalizedActions
      };
    }

    throw new Error("Invalid AI Governance Output");

  } catch (err) {
    console.warn("Local Qwen AI failed, falling back to local governance rules:", err);
  }

  // ✅ DETERMINISTIC GOVERNANCE FALLBACK (SAFE DEFAULTS)
  if (risk.level === "MEDIUM") {
    const safeActions = plan.actions.filter(
      (a: any) => a.type === "DIVERSIFY" || a.type === "ALERT"
    );

    return {
      approved: true,
      reason: "Moderate risk detected. Only safe diversification actions allowed.",
      enforcedActions: safeActions
    };
  }

  if (risk.level === "LOW") {
    return {
      approved: true,
      reason: "Low risk treasury. All protection actions approved.",
      enforcedActions: plan.actions
    };
  }

  return {
    approved: false,
    reason: "Unrecognized risk state. Governance blocked execution.",
    enforcedActions: [
      {
        type: "ALERT",
        message: "Governance fallback activated. No automated actions allowed."
      }
    ]
  };
}
