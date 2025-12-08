import type { RiskResult, ProtectionPlan } from "../types.ts";

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
function isValidProtectionPlan(obj: any): obj is ProtectionPlan {
  return (
    obj &&
    Array.isArray(obj.actions) &&
    obj.actions.every(
      (a: any) =>
        a &&
        (a.type === "ALERT" || a.type === "REDUCE" || a.type === "DIVERSIFY") &&
        typeof a.message === "string"
    )
  );
}

// ✅ MAIN PLANNER (NOW FULLY LOCAL + UNLIMITED)
export async function generateProtectionPlan(risk: RiskResult): Promise<ProtectionPlan> {
  try {
    const prompt = `
You are a DeFi treasury strategist.

Based on the given RiskResult, create a protection plan using ONLY:
- ALERT
- REDUCE
- DIVERSIFY

⚠️ YOU MUST RETURN STRICT JSON ONLY in this exact format:

{
  "actions": [
    { "type": "ALERT" | "REDUCE" | "DIVERSIFY", "message": string }
  ]
}

RISK RESULT:
${JSON.stringify(risk, null, 2)}
`;

    const out = await callLocalLLM(prompt);

    const parsed = extractJson(out);

    if (isValidProtectionPlan(parsed)) {
      return parsed; // ✅ REAL AI RESULT
    }

    throw new Error("Invalid AI Protection Plan Output");

  } catch (err) {
    console.warn("Local Qwen AI failed, using deterministic planner:", err);
  }

  // ✅ DETERMINISTIC FALLBACK (UNCHANGED, SAFE)
  const actions: Array<{ type: "ALERT" | "REDUCE" | "DIVERSIFY"; message: string }> = [];

  if (risk.level === "HIGH") {
    actions.push({ type: "ALERT", message: "Immediate risk detected. Manual review required." });
    actions.push({ type: "REDUCE", message: "Reduce high exposure positions immediately." });
  }

  if (risk.level === "MEDIUM") {
    actions.push({ type: "DIVERSIFY", message: "Diversify treasury across multiple stable assets." });
  }

  if (risk.level === "LOW") {
    actions.push({ type: "ALERT", message: "Treasury is currently stable." });
  }

  return { actions };
}
