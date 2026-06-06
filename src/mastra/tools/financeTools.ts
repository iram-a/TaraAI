import { pool } from "../db.js";;

export async function getTotalSpending() {
  const result = await pool.query(`
    SELECT SUM(amount) AS total_spending
    FROM transactions
  `);

  return result.rows[0];
}

export async function getSpendingByCategory() {
  const result = await pool.query(`
    SELECT
      category,
      SUM(amount) AS total
    FROM transactions
    GROUP BY category
    ORDER BY total DESC
  `);

  return result.rows;
}

export async function getTopMerchants() {
  const result = await pool.query(`
    SELECT
      merchant,
      SUM(amount) AS total
    FROM transactions
    GROUP BY merchant
    ORDER BY total DESC
    LIMIT 10
  `);

  return result.rows;
}
export async function getPortfolioValue() {
  const result = await pool.query(`
    SELECT
      h.fund_id,
      f.name,
      h.units,
      latest.nav,
      ROUND((h.units * latest.nav)::numeric, 2) AS current_value
    FROM holdings h
    JOIN funds f
      ON h.fund_id = f.id
    JOIN (
      SELECT DISTINCT ON (fund_id)
        fund_id,
        nav
      FROM fund_navs
      ORDER BY fund_id, nav_date DESC
    ) latest
      ON h.fund_id = latest.fund_id
    ORDER BY current_value DESC
  `);

  return result.rows;
}

export async function getFundPerformance() {
  const result = await pool.query(`
    SELECT
      f.name,
      h.purchase_nav,
      latest.nav AS current_nav,

      ROUND(
        (
          (latest.nav - h.purchase_nav)
          / h.purchase_nav * 100
        )::numeric,
        2
      ) AS return_pct

    FROM holdings h

    JOIN funds f
      ON h.fund_id = f.id

    JOIN (
      SELECT DISTINCT ON (fund_id)
        fund_id,
        nav
      FROM fund_navs
      ORDER BY fund_id, nav_date DESC
    ) latest
      ON latest.fund_id = h.fund_id

    ORDER BY return_pct DESC
  `);

  return result.rows;
}

export async function getMonthlySpending() {
  const result = await pool.query(`
    SELECT
      DATE_TRUNC('month', date) AS month,
      SUM(amount) AS total
    FROM transactions
    GROUP BY month
    ORDER BY month
  `);

  return result.rows;
}

export async function getLargestTransactions(
  limit = 10
) {
  const result = await pool.query(
    `
    SELECT
      date,
      merchant,
      amount,
      category
    FROM transactions
    ORDER BY amount DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const totalSpendingTool = createTool({
  id: "total-spending",

  description:
    "Returns total spending across all transactions",

  inputSchema: z.object({}),

  outputSchema: z.object({
    total_spending: z.any(),
  }),

  execute: async () => {
    return await getTotalSpending();
  },
});

export const spendingByCategoryTool = createTool({
  id: "spending-by-category",

  description:
    "Returns spending grouped by category",

  inputSchema: z.object({}),

  outputSchema: z.any(),

  execute: async () => {
    return await getSpendingByCategory();
  },
});

export const topMerchantsTool = createTool({
  id: "top-merchants",

  description: "Returns top merchants by spending",

  inputSchema: z.object({}),

  outputSchema: z.any(),

  execute: async () => {
    return await getTopMerchants();
  },
});

export const portfolioSummaryTool = createTool({
  id: "portfolio-summary",

  description: "Returns current portfolio value by fund",

  inputSchema: z.object({}),

  outputSchema: z.any(),

  execute: async () => {
    return await getPortfolioValue();
  },
});

export const fundReturnsTool = createTool({
  id: "fund-returns",

  description: "Returns performance of all held funds",

  inputSchema: z.object({}),

  outputSchema: z.any(),

  execute: async () => {
    return await getFundPerformance();
  },
});

export const largestTransactionsTool = createTool({
  id: "largest-transactions",

  description: "Returns largest transactions",

  inputSchema: z.object({
    limit: z.number().optional(),
  }),

  outputSchema: z.any(),

  execute: async ({ context }) => {
    return await getLargestTransactions(
      context.limit ?? 10
    );
  },
});