# Design

## Overview
TaraAI is a **Mastra**-based agent project that answers finance questions using **tool-backed SQL** over a local database (Postgres/compatible via `pg`).

Core idea: the LLM should **not** guess—answers must come from deterministic tool output.

## Architecture

### 1) Mastra runtime
- `src/mastra/index.ts` instantiates `Mastra`.
- Registers the `financeAgent`.
- Configures Mastra storage (LibSQL default + DuckDB domain for observability).

### 2) Agent
- `src/mastra/agents/finance-agent.ts`
- Uses model: `google/gemini-2.5-flash`
- Strong instructions: *never invent/estimate numbers*, *always use tools*, *only report tool output*.
- Tools are SQL-backed and return DB rows.

### 3) Tools (SQL execution)
Two tool sets exist in the repo:

#### A) Curated finance tools
- `src/mastra/tools/financeTools.ts`
- Exposes domain-specific helpers (total spending, spending by category, top merchants, portfolio value, fund performance, monthly spending, largest transactions).

#### B) Generic analytics tools
- `src/mastra/tools/transactionAnalyticsTool.ts`
- `src/mastra/tools/holdingAnalyticsTool.ts`
- `src/mastra/tools/portfolioAnalyticsTool.ts`
- `src/mastra/tools/fundAnalyticsTool.ts`

These tools accept a `sql: string` input and return raw `rows`.

> Note: In `finance-agent.ts`, both curated tools and the generic transaction tool are currently referenced.

### 4) Database layer
- `src/mastra/db.ts`
  - Creates a `pg.Pool` from `DATABASE_URL`.
  - Logs whether `DATABASE_URL` exists.

- `src/mastra/schema.sql`
  - Defines required tables (transactions, holdings, funds, fund_navs, etc.).

### 5) Workflows
- `src/mastra/workflows/financeWorkflow.ts`
It is not wired to the finance agent in `src/mastra/index.ts`.

### 6) Evals / scorers
- `src/mastra/scorers/financeScorer.ts`
  - Contains evaluation scaffolding (completeness, tool appropriateness, translation quality).

- `eval/`
  - Includes `questions.json` and `run-eval.ts` to run evaluations.

## Data & ingestion

### Sample datasets
- `data/sample_a/*`
- `data/sample_b/*`
- `data/sample_c/*`

These contain JSON files for `funds.json`, `holdings.json`, `transactions.json`.

### Ingest script
- `src/mastra/scripts/ingest.ts` (in `.agents/skills/mastra/scripts/ingest.ts` as well, depending on your setup)

The intended flow:
1. Load sample JSON.
2. Normalize values (see `src/utils/Normalizer.ts`).
3. Insert/update rows into the DB.
4. Populate NAV history (`fund_navs`) so portfolio/fund return calculations work.

## Interaction flows

### Typical question: “How much did I spend?”
1. User asks finance question.
2. Agent selects `total-spending` tool.
3. Tool runs SQL query.
4. Agent returns `total_spending` from tool output.

### Typical question: “Top merchants”
1. Agent calls `top-merchants`.
2. SQL aggregates by `merchant`.
3. Agent returns tool rows.

### Typical question: “Current portfolio”
1. Agent calls `portfolio-summary`.
2. SQL joins `holdings` + latest `fund_navs`.
3. Agent returns fund-level values.

## Security / correctness considerations

1. **Determinism over hallucination**
   - Instructions enforce that answers must originate from tool output.

2. **SQL tool risk**
   - The generic analytics tools that accept `sql` are powerful.
   - In production, you should restrict/validate SQL to prevent destructive queries.

3. **Environment configuration**
   - The agent tools depend on `DATABASE_URL`.
   - Without it, every tool call fails.

4. **Data freshness**
   - NAV-derived calculations depend on `fund_navs` having recent records.

## Suggested improvements (optional)
- finance workflows are intended.
- Wire all finance-related tools consistently.
- Add SQL validation for `transactionAnalyticsTool` (and other generic sql tools).
- Add a “healthcheck” tool that verifies DB connectivity + row counts before answering.

