# TaraAI

Mastra-based finance analysis agent that answers questions using **tool-backed SQL** over your local database.

> Key constraint: the agent is instructed to **never invent or estimate numbers** and to **only report values returned by tools**.

## Project Structure
- `src/mastra/index.ts` — Mastra runtime + agent registration
- `src/mastra/agents/finance-agent.ts` — Finance agent configuration (model + instructions + tools)
- `src/mastra/db.ts` — PostgreSQL connection (`pg.Pool`) via `DATABASE_URL`
- `src/mastra/tools/*` — SQL-backed tools
- `src/mastra/schema.sql` — DB schema
- `data/sample_*/*` — sample JSON datasets
- `eval/*` — eval harness

## Prerequisites
- Node.js >= **22.13.0**
- A database reachable via `DATABASE_URL`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Create/edit `src/mastra/.env`
   - Required: `DATABASE_URL`

   Example:
   ```env
   DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
   ```

3. Initialize the database schema:
   - Use `src/mastra/schema.sql` to create tables.

4. Load data (recommended for local testing):
   - Use the sample datasets in `data/sample_a`, `data/sample_b`, `data/sample_c`.
   - The ingest script(s) in the repo are intended for loading these into your DB.


## Run (local dev)
```bash
npm run dev
```
- Mastra Studio + API will start locally.

## Use the agent
In Mastra Studio, chat with the registered `financeAgent`:
- “How much did I spend in total?”
- “Top merchants”
- “Current portfolio by fund”
- “Fund performance / returns”

## Tools
The finance agent includes curated tools in:
- `src/mastra/tools/financeTools.ts`

It also includes generic SQL analytics tools (powerful):
- `src/mastra/tools/transactionAnalyticsTool.ts`
- `src/mastra/tools/holdingAnalyticsTool.ts`
- `src/mastra/tools/portfolioAnalyticsTool.ts`
- `src/mastra/tools/fundAnalyticsTool.ts`

## Notes / Known Issues
- `src/mastra/workflows/financeWorkflow.ts` currently contains a **weather** workflow (not finance). It is not registered in `src/mastra/index.ts`.
- During development, the DB must be reachable. If `DATABASE_URL` is missing, tool calls will fail.

## Docs
- `design.md` — architecture and data flow
- `AGENTS.md` — Mastra skill loading and rules

