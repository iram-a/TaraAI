import { z } from "zod";
import { pool } from "../db.js";
import { createTool } from "@mastra/core/tools";

export const transactionAnalyticsTool = createTool({
  id: "transaction-analytics",

  description:
    "Runs SQL on transactions. Supports date filters, refunds, transfers, grouping.",

  inputSchema: z.object({
    sql: z.string(),
  }),

  execute: async ({ context }) => {
    const result = await pool.query(context.sql);
    return result.rows;
  },
});