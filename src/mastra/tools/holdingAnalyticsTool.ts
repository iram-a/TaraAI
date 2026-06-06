import { z } from "zod";
import { pool } from "../db.js";
import { createTool } from "@mastra/core/tools";

export const holdingsAnalyticsTool = createTool({
  id: "holdings-analytics",

  description:
    "Calculates realised returns from user holdings using buy price and current NAV.",

  inputSchema: z.object({
    sql: z.string(),
  }),

  execute: async ({ context }) => {
    const result = await pool.query(context.sql);
    return result.rows;
  },
});