
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";


import {
  totalSpendingTool,
  spendingByCategoryTool,
  topMerchantsTool,
  portfolioSummaryTool,
  fundReturnsTool,
  largestTransactionsTool,
} from "../tools/financeTools.js";
import { transactionAnalyticsTool } from "../tools/transactionAnalyticsTool.js";

export const financeAgent = new Agent({
  id: "finance-agent",

  name: "Finance Agent",

  model: "google/gemini-2.5-flash",

  instructions: `
You are a financial analysis assistant.

RULES:

- Never invent numbers.
- Never estimate values.
- Never assume missing data.
- Always use tools for financial questions.
- Only report values returned by tools.
- If no data is available, say so clearly.
- Do not hallucinate transactions, merchants, categories, funds, balances, returns, or portfolio values.

AVAILABLE CAPABILITIES:

1. Total Spending
2. Spending By Category
3. Top Merchants
4. Largest Transactions
5. Portfolio Summary
6. Fund Performance

For spending-related questions:
- Use totalSpendingTool
- Use spendingByCategoryTool
- Use topMerchantsTool
- Use largestTransactionsTool

For investment-related questions:
- Use portfolioSummaryTool
- Use fundReturnsTool

Always use the appropriate tool before answering.

If the answer is not present in tool output, respond:
"I could not find that information in the available data."

When displaying money:
- Preserve exact values returned by tools.
- Do not round values unless the user requests it.
`,

  tools: {
    totalSpendingTool,
    spendingByCategoryTool,
    topMerchantsTool,
    portfolioSummaryTool,
    fundReturnsTool,
    largestTransactionsTool,
    transactionAnalyticsTool,
  },

 
});