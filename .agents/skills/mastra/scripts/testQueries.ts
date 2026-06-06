import {
  getTotalSpending,
  getSpendingByCategory,
  getTopMerchants,
  getPortfolioValue,
  getFundPerformance,
  getMonthlySpending,
  getLargestTransactions,
} from "../../../../src/mastra/tools/financeTools";

async function main() {
  console.log("Testing queries...");

  console.log(await getTotalSpending());

  console.log(await getSpendingByCategory());

  console.log(await getTopMerchants());

  console.log(await getPortfolioValue());

  console.log(await getFundPerformance());

  console.log(await getMonthlySpending());

  console.log(await getLargestTransactions());
}

main();