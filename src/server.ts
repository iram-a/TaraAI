import express from "express";
import { financeAgent } from "./mastra/agents/finance-agent.js";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
   const response = await financeAgent.generate(question);

    res.json({
      answer: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Agent failed" });
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});