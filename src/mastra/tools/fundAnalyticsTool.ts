import { z } from "zod";
import { pool } from "../db.js";
import { createTool } from "@mastra/core/tools";

export const fundAnalyticsTool = createTool({
  id: "fund-analytics",

  description:
    "Computes fund returns, rankings, and period performance using NAV history.",

  inputSchema: z.object({
    sql: z.string(),
  }),

  execute: async ({ context }) => {
    const result = await pool.query(context.sql);
    return result.rows;
  },
});