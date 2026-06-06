import express from "express";
import { financeAgent } from "./mastra/agents/finance-agent.js";

const app = express();
app.use(express.json());

/**
 * Health check route (fixes "Cannot GET /")
 */
app.get("/", (req, res) => {
  res.json({
    status: "TaraAI is running",
    endpoint: "/ask",
  });
});

/**
 * Main API endpoint
 */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await financeAgent.generate(question);

    console.log("AGENT RESPONSE:");
    console.dir(response, { depth: null });

    res.json({
      answer:
        (response as any)?.text ??
        (response as any)?.output ??
        JSON.stringify(response),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Agent failed",
    });
  }
});
/**
 * Render requires PORT binding
 */
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});