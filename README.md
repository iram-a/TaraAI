# TaraAI – Financial Intelligence Assistant

## Overview

TaraAI is an AI-powered financial assistant built using Mastra, Google Gemini, PostgreSQL, and Express.js.

The system ingests transaction, holdings, fund, and NAV datasets into PostgreSQL and allows users to ask natural language questions about their finances through a single API endpoint.

Examples:

* What is my total spending?
* Show spending by category.
* Who are my top merchants?
* Show my largest transactions.
* What is my portfolio summary?
* Show fund returns.

---

## Architecture

Dataset Files (JSON)
↓
Ingestion Pipeline
↓
PostgreSQL Database
↓
Mastra Tools
↓
Finance Agent (Gemini)
↓
Express API
↓
POST /ask

---

## Technology Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Neon Database
* Mastra AI Framework
* Google Gemini 2.5 Flash
* Render Deployment

---

## Project Structure

src/
├── server.ts
├── mastra/
│   ├── agents/
│   │   └── finance-agent.ts
│   ├── tools/
│   │   ├── financeTools.ts
│   │   └── transactionAnalyticsTool.ts
│   └── db.ts

scripts/
├── setup-db.ts
└── ingest.ts

data/
└── sample_a/

---

## Database Schema

### transactions

* id
* txn_date
* merchant
* merchant_canonical
* category
* amount
* currency
* memo

### funds

* fund_id
* name
* category

### fund_navs

* fund_id
* nav_date
* nav

### holdings

* id
* fund_id
* units
* purchase_date
* purchase_nav

---

## Environment Variables

Create a .env file:

DATABASE_URL=your_postgres_connection_string

GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

PORT=3000

---

## Installation

Install dependencies:

npm install

---

## Database Setup

Create tables:

npx tsx .agents/skills/mastra/scripts/setup-db.ts

Load data:

npx tsx .agents/skills/mastra/scripts/ingest.ts

Verify data:

SELECT COUNT(*) FROM transactions;

---

## Running Locally

npm run dev

Server:

http://localhost:3000

---

## API

### POST /ask

Request

{
"question": "What is my total spending?"
}

Response

{
"answer": "Your total spending is ..."
}

---

## Deployment

Base URL

https://taraai-vwrk.onrender.com

Endpoint

POST https://taraai-vwrk.onrender.com/ask

---

## Example Queries

What is my total spending?

Show spending by category.

Who are my top merchants?

Show largest transactions.

Show my portfolio summary.

Show fund returns.

---

## Known Limitations

* Render free tier may experience cold starts.
* Response speed depends on Gemini API latency.
* Financial insights are limited to the ingested dataset.
* The system does not execute financial transactions.
* Hidden datasets must follow the expected logical structure for ingestion.

---

## Author

IRAM REHMAT ANSARI
