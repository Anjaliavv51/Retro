# 📡 Retro API Reference Manual

Comprehensive documentation of all available serverless edge routes, backend controllers, and AI agent endpoints.

---

## 🗄️ Database & AI Agent Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET`, `POST` | `/api/db-agent/query` | Executes natural language query translated into safe MongoDB MQL. | No (Read-Only) |
| `GET` | `/api/db-agent/schema` | Retrieves database schema introspection data for AI and admins. | No |
| `GET` | `/api/db-agent/stats` | Reports active MongoDB connection state and collection record counts. | No |
| `GET` | `/api/db-agent/examples` | Returns curated quick-start sample queries for the UI console. | No |
| `GET`, `POST` | `/api/search/rag` | Retrieval-Augmented Generation product search across vintage catalog. | No |
| `GET`, `POST` | `/api/rag-search` | Alias endpoint for RAG semantic product retrieval. | No |

---

## 📦 Storefront & Utility Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check reporting platform, uptime, and status. | No |
| `GET` | `/api/message` | Welcome message and platform announcement banner. | No |
| `GET` | `/api/products` | Dynamic list of featured vintage catalog products. | No |
| `POST` | `/api/contact` | Submits customer inquiries and generates support ticket IDs. | No |
| `POST` | `/api/newsletter` | Enrolls customer email into vintage drops & promotions. | No |
| `GET` | `/api/reviews` | Retrieves verified customer feedback and star ratings. | No |
| `POST` | `/api/reviews` | Submits a new customer product review. | No |

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers a new user account with hashed credentials. | No |
| `POST` | `/api/auth/signin` | Authenticates user credentials and issues JWT cookie. | No |
| `POST` | `/api/auth/logout` | Invalidates authentication session and clears cookie. | Yes (JWT) |
| `GET` | `/api/auth/user` | Retrieves authenticated user profile details. | Yes (JWT) |

---
*Auto-generated and maintained by Retro Maintenance Agent.*
