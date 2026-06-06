import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log("Creating tables...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        txn_date DATE NOT NULL,
        merchant TEXT NOT NULL,
        merchant_canonical TEXT NOT NULL,
        category TEXT,
        amount NUMERIC(12,2) NOT NULL,
        currency TEXT,
        memo TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS funds (
        fund_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS fund_navs (
        fund_id TEXT NOT NULL,
        nav_date DATE NOT NULL,
        nav NUMERIC(12,4) NOT NULL,

        PRIMARY KEY (fund_id, nav_date),

        CONSTRAINT fk_fund_navs_fund
        FOREIGN KEY (fund_id)
        REFERENCES funds(fund_id)
        ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS holdings (
        id SERIAL PRIMARY KEY,
        fund_id TEXT NOT NULL,
        units NUMERIC(18,6) NOT NULL,
        purchase_date DATE NOT NULL,
        purchase_nav NUMERIC(12,4) NOT NULL,

        CONSTRAINT fk_holdings_fund
        FOREIGN KEY (fund_id)
        REFERENCES funds(fund_id)
        ON DELETE CASCADE
      );
    `);

    console.log("Creating indexes...");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date
      ON transactions(txn_date);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_category
      ON transactions(category);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_merchant
      ON transactions(merchant_canonical);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_amount
      ON transactions(amount);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_fund_navs_fund_date
      ON fund_navs(fund_id, nav_date);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_holdings_fund
      ON holdings(fund_id);
    `);

    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Database setup failed:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

setupDatabase();