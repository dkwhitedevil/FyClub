export async function callLocalLLM(prompt: string): Promise<string> {
  const res = await fetch("https://ollama-qwen.zeabur.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5",
      prompt,
      stream: false
    })
  });

  const data = await res.json();
  return data.response;
}
