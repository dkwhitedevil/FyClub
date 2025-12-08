import Fastify from "fastify";
import cors from "@fastify/cors";
import * as dotenv from "dotenv";

import { runTreasuryWorkflow } from "../../../packages/agents-core/src/workflows/treasuryWorkflow.ts";

dotenv.config();

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: "*"
});

// ✅ MAIN API ENDPOINT
server.post("/api/risk-scan", async (request, reply) => {
  try {
    const { address } = request.body as any;

    if (!address) {
      return reply.status(400).send({ error: "Treasury address is required" });
    }

    const result = await runTreasuryWorkflow(address);

    return reply.send(result);
  } catch (err) {
    console.error("API Error:", err);
    return reply.status(500).send({
      error: "Internal server error",
      details: String(err)
    });
  }
});

// ✅ HEALTH CHECK (FOR DEPLOYMENT)
server.get("/health", async () => {
  return { status: "ok", service: "KRWQ Treasury Guardian API" };
});

const PORT = Number(process.env.PORT || 3001);

server.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
