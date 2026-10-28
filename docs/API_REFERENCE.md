# 📖 Retro Vintage E-Commerce API Reference

> Last synchronized with production routes: **2026-10-28** (2026-10-28T10:22:31.559Z)

---

## 🌟 Overview
This documentation provides a comprehensive specification of all active RESTful APIs, database agents, and serverless handlers in the Retro project.

---

## 1. 🤖 Database AI Agent Endpoints
**Base Path**: `/api/db-agent`

| Method | Endpoint / Action | Description | Sample Query / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/schema` | Retrieves database schema summary for products, users, and reviews | `/api/db-agent/schema` |
| **GET** | `/examples` | Returns sample natural-language queries supported by agent | `/api/db-agent/examples` |
| **GET** | `?query=<nl_query>` | Translates natural language query into MongoDB command and executes | `?query=Find audio under $100` |
| **POST** | `/` | Executes JSON payload with natural language query | `{ "query": "Top 3 highest rated cameras" }` |

---

## 2. 🛍️ Storefront & Products Endpoints
**Base Path**: `/api` or local `http://localhost:5000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/products` | Retrieves complete vintage product catalog |
| **GET** | `/reviews` | Retrieves recent customer reviews |
| **POST** | `/reviews` | Submits a new user product review |
| **GET** | `/cart` | Gets session shopping cart contents |

---

## 3. 🔐 Authentication & Session
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/login` | User authentication and session token issuance |
| **POST** | `/signup` | New vintage customer registration |
| **GET** | `/logout` | Invalidates active user session |

---

*Automated sync managed by Retro Daily Maintenance Agent.*
