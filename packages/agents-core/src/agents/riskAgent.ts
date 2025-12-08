import type { TreasurySnapshot, RiskResult } from "../types.ts";

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
 * Strong validation against malformed AI output
 */
function isValidRiskResult(obj: any): obj is RiskResult {
  return (
    obj &&
    (obj.level === "LOW" || obj.level === "MEDIUM" || obj.level === "HIGH") &&
    typeof obj.score === "number" &&
    Array.isArray(obj.issues)
  );
}

// ✅ MAIN RISK ANALYZER (NOW FULLY LOCAL + UNLIMITED)
export async function analyzeRisk(snapshot: TreasurySnapshot): Promise<RiskResult> {
  try {
    const prompt = `
You are a professional DeFi risk analyst.

Analyze this treasury snapshot and RETURN STRICT JSON ONLY in this exact format:

{
  "level": "LOW" | "MEDIUM" | "HIGH",
  "score": number,
  "issues": string[]
}

TREASURY SNAPSHOT:
${JSON.stringify(snapshot, null, 2)}
`;

    const out = await callLocalLLM(prompt);

    // ✅ SAFETY GUARD: Validate output before JSON.parse
    if (!out || typeof out !== "string") {
      throw new Error("Empty AI output");
    }

    const trimmed = out.trim();

    // Auto-extract JSON if model adds explanation
    const jsonStart = trimmed.indexOf("{");
    const jsonEnd = trimmed.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in AI output");
    }

    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));

    if (isValidRiskResult(parsed)) {
      return parsed; // ✅ REAL AI RESULT
    }

    throw new Error("Invalid AI Risk Output");

  } catch (err) {
    console.warn("Local Qwen AI failed, using deterministic fallback:", err);
  }

  // ✅ DETERMINISTIC FALLBACK (YOU ALREADY TRUST THIS LOGIC)
  const issues: string[] = [];
  let score = 100;

  if (snapshot.totalUsdValue > 100000) {
    issues.push("Large treasury exposure detected.");
    score -= 25;
  }

  if (snapshot.positions.length === 1) {
    issues.push("Treasury fully concentrated in a single asset.");
    score -= 40;
  }

  let level: RiskResult["level"] = "LOW";
  if (score < 70) level = "MEDIUM";
  if (score < 40) level = "HIGH";

  return {
    level,
    score,
    issues
  };
}
