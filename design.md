# TaraAI Design Document

## Problem Statement

Users often have financial data spread across transactions, holdings, and investment records. Extracting useful insights requires querying multiple datasets and manually calculating metrics.

TaraAI solves this by combining structured PostgreSQL queries with an AI agent capable of understanding natural language questions.

---

# Design Goals

1. Natural language financial querying.
2. Reliable numerical accuracy.
3. Separation of AI reasoning and data retrieval.
4. Support for unseen datasets through normalization.
5. Scalable architecture for future tools.

---

# System Architecture

User
↓
POST /ask
↓
Express Server
↓
Finance Agent
↓
Tool Selection
↓
PostgreSQL Queries
↓
Structured Results
↓
Gemini Response
↓
JSON Output

---

# Data Ingestion Strategy

Incoming datasets may use different field names.

Examples:

transaction_date
txn_date
date

merchant_name
merchant
vendor

The ingestion layer normalizes these variations into a canonical schema before insertion into PostgreSQL.

Example:

{
"transaction_date": "2025-01-01",
"vendor": "Amazon",
"value": 500
}

becomes

{
"txn_date": "2025-01-01",
"merchant": "Amazon",
"amount": 500
}

This design improves robustness against unseen datasets.

---

# Database Design

## transactions

Stores all spending activity.

Indexes:

* txn_date
* category
* merchant_canonical
* amount

Purpose:

Fast aggregation and filtering.

---

## funds

Stores fund metadata.

Purpose:

Lookup and relationship management.

---

## fund_navs

Stores historical NAV records.

Purpose:

Performance calculations and portfolio valuation.

---

## holdings

Stores investment positions.

Purpose:

Portfolio analysis and return computation.

---

# AI Agent Design

The Finance Agent uses Google Gemini 2.5 Flash.

Responsibilities:

* Understand user intent.
* Select the correct tool.
* Generate natural language responses.
* Avoid hallucinating financial values.

Rules:

* Never invent numbers.
* Always use tools for financial data.
* Report only tool-generated values.

---

# Tool Design

## totalSpendingTool

Returns:

SUM(amount)

Use Cases:

* Total spending
* Overall expenses

---

## spendingByCategoryTool

Returns:

Category-wise aggregation.

Use Cases:

* Expense breakdown
* Budget analysis

---

## topMerchantsTool

Returns:

Highest spending merchants.

Use Cases:

* Vendor analysis

---

## largestTransactionsTool

Returns:

Highest value transactions.

Use Cases:

* Spending audits

---

## portfolioSummaryTool

Returns:

Current value of holdings.

Use Cases:

* Portfolio overview

---

## fundReturnsTool

Returns:

Percentage returns for investments.

Use Cases:

* Performance analysis

---

# Performance Optimizations

1. Database indexing.
2. Aggregation performed in SQL.
3. Minimal data transferred to the LLM.
4. Tool-based retrieval instead of loading full datasets.
5. Normalized merchant names.

---

# Error Handling

Implemented for:

* Missing questions.
* Empty datasets.
* Database failures.
* API failures.
* Invalid ingestion records.

---

# Deployment

Hosting:

* Render

Database:

* Neon PostgreSQL

LLM:

* Google Gemini 2.5 Flash

API Endpoint:

POST /ask

---

# Future Improvements

* Multi-user support.
* Authentication.
* Spending trend forecasting.
* Portfolio risk analytics.
* Transaction categorization using machine learning.
* Dashboard UI.

---

# Conclusion

TaraAI combines structured financial data retrieval with AI-powered reasoning. The system prioritizes correctness by using database-backed tools and minimizes hallucination through strict agent instructions and tool-driven responses.
