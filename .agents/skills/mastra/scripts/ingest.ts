import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { pool } from "../../../../src/mastra/db";

dotenv.config({ path: "src/.env" });

const DATA_DIR =
  process.env.DATA_DIR || "./data/sample_a";

/* --------------------------
   NORMALIZATION HELPERS
-------------------------- */

function normalizeTransaction(raw: any) {
  return {
    id:
      raw.id ??
      raw.transaction_id ??
      raw.txn_id ??
      null,

    date:
      raw.date ??
      raw.transaction_date ??
      raw.txn_date ??
      null,

    merchant:
      raw.merchant ??
      raw.merchant_name ??
      raw.vendor ??
      raw.payee ??
      "UNKNOWN",

    amount:
      raw.amount ??
      raw.txn_amount ??
      raw.value ??
      null,

    category:
      raw.category ??
      "uncategorized",

    currency:
      raw.currency ??
      "INR",

    memo:
      raw.memo ??
      raw.description ??
      "",
  };
}

function canonicalizeMerchant(name: string) {
  if (!name) return null;

  const m = name.toUpperCase();

  if (m.includes("AIR INDIA")) return "AIR INDIA";
  if (m.includes("INDIGO")) return "INDIGO";
  if (m.includes("AMAZON")) return "AMAZON";
  if (m.includes("APOLLO")) return "APOLLO";
  if (m.includes("SWIGGY")) return "SWIGGY";
  if (m.includes("ZOMATO")) return "ZOMATO";

  return m;
}

/* --------------------------
   TRANSACTIONS
-------------------------- */

async function ingestTransactions() {
  const filePath = path.join(
    DATA_DIR,
    "transactions.json"
  );

  const transactions = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  let inserted = 0;

  for (const rawTxn of transactions) {
    const txn = normalizeTransaction(rawTxn);

    if (!txn.id || txn.amount == null) {
      continue;
    }

    await pool.query(
      `
      INSERT INTO transactions
      (
        id,
        date,
        merchant,
        canonical_merchant,
        category,
        amount,
        currency,
        memo
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        txn.id,
        txn.date,
        txn.merchant,
        canonicalizeMerchant(txn.merchant),
        txn.category,
        txn.amount,
        txn.currency,
        txn.memo,
      ]
    );

    inserted++;
  }

  console.log(
    `Inserted ${inserted} transactions`
  );
}

/* --------------------------
   FUNDS
-------------------------- */

async function ingestFunds() {
  const filePath = path.join(
    DATA_DIR,
    "funds.json"
  );

  const funds = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  let insertedFunds = 0;
  let insertedNavs = 0;

  for (const fund of funds) {
    const fundId =
      fund.id ??
      fund.fund_id;

    const fundName =
      fund.name ??
      fund.fund_name;

    const category =
      fund.category ??
      "unknown";

    await pool.query(
      `
      INSERT INTO funds
      (
        id,
        name,
        category
      )
      VALUES ($1,$2,$3)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        fundId,
        fundName,
        category,
      ]
    );

    insertedFunds++;

    const navHistory =
      fund.nav ??
      fund.nav_history ??
      [];

    for (const nav of navHistory) {
      await pool.query(
        `
        INSERT INTO fund_navs
        (
          fund_id,
          nav_date,
          nav
        )
        VALUES ($1,$2,$3)
        `,
        [
          fundId,
          nav.date,
          nav.value ?? nav.nav,
        ]
      );

      insertedNavs++;
    }
  }

  console.log(
    `Inserted ${insertedFunds} funds`
  );

  console.log(
    `Inserted ${insertedNavs} NAV records`
  );
}

/* --------------------------
   HOLDINGS
-------------------------- */

async function ingestHoldings() {
  const filePath = path.join(
    DATA_DIR,
    "holdings.json"
  );

  const holdings = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  let inserted = 0;

  for (const holding of holdings) {
    await pool.query(
      `
      INSERT INTO holdings
      (
        fund_id,
        units,
        purchase_date,
        purchase_nav
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        holding.fund_id ??
          holding.id,

        holding.units,

        holding.purchase_date,

        holding.purchase_nav,
      ]
    );

    inserted++;
  }

  console.log(
    `Inserted ${inserted} holdings`
  );
}

/* --------------------------
   MAIN
-------------------------- */

async function main() {
  try {
    await ingestTransactions();
    await ingestFunds();
    await ingestHoldings();

    console.log(
      "Ingestion completed successfully"
    );
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();