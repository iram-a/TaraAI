import { z } from "zod";
import { pool } from "../db.js";
import { createTool } from "@mastra/core/tools";

export const portfolioAnalyticsTool = createTool({
  id: "portfolio-analytics",

  description:
    "Computes total portfolio value, invested amount, and PnL.",

  inputSchema: z.object({
    sql: z.string(),
  }),

  execute: async ({ context }) => {
    const result = await pool.query(context.sql);
    return result.rows;
  },
});