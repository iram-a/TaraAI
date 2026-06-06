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

  if (!question) {
    return res.status(400).json({
      error: "question is required",
    });
  }

  try {
    // REAL agent call (Mastra)
    const response = await financeAgent.generate(question);

    res.json({
      answer: (response as any)?.text ?? (response as any)?.output ?? response,
    });
  } catch (err) {
    console.error("ASK ERROR:", err);

    res.status(500).json({
      error: "Agent failed",
      details: err instanceof Error ? err.message : String(err),
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