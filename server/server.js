import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

import { searchRAG } from "./ragSearchEngine.js";

// Serve the root of the repo (.. from /server) so index.html and assets work
app.use(express.static(path.join(__dirname, "..")));

// Example dynamic endpoint
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the server" });
});

// Retrieval-Augmented Generation (RAG) Product Search Endpoint
async function handleRagSearch(req, res) {
  try {
    const query = req.method === "GET" 
      ? (req.query.q || req.query.query || "") 
      : (req.body.q || req.body.query || "");

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: "Search query is required. Provide ?q=... or JSON { query: '...' }"
      });
    }

    const topK = parseInt(req.method === "GET" ? req.query.limit : req.body.limit, 10) || 4;
    const result = await searchRAG(query.trim(), topK);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(result);
  } catch (err) {
    console.error("[RAG API Error]:", err);
    return res.status(500).json({
      success: false,
      error: "RAG search failed: " + err.message
    });
  }
}

app.get("/api/search/rag", handleRagSearch);
app.post("/api/search/rag", handleRagSearch);
app.get("/api/rag-search", handleRagSearch);
app.post("/api/rag-search", handleRagSearch);

// Retro AI Database Agent Endpoints
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { processDbAgentQuery, SCHEMA_CATALOG } = require("../backend/agent/dbAgent.js");
const { defaultProducts, defaultReviews, defaultUsers } = require("../backend/config/seedData.js");

async function handleDbAgentQuery(req, res) {
  try {
    const query = req.method === "GET"
      ? (req.query.q || req.query.query || "")
      : (req.body ? (req.body.q || req.body.query || "") : "");

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required. Provide ?q=... or JSON { query: '...' }"
      });
    }

    const result = await processDbAgentQuery(query.trim());
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(result);
  } catch (err) {
    console.error("[DB Agent API Error]:", err);
    return res.status(500).json({
      success: false,
      error: "DB Agent query failed: " + err.message
    });
  }
}

app.get("/api/db-agent/query", handleDbAgentQuery);
app.post("/api/db-agent/query", handleDbAgentQuery);
app.get("/api/db-agent", handleDbAgentQuery);
app.post("/api/db-agent", handleDbAgentQuery);

app.get("/api/db-agent/schema", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ success: true, schemas: SCHEMA_CATALOG });
});

app.get("/api/db-agent/stats", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    success: true,
    status: "online",
    connection: {
      host: "localhost (in-memory mode)",
      database: "Retro Local Database",
      readyState: 1
    },
    counts: {
      products: defaultProducts.length,
      users: defaultUsers.length,
      reviews: defaultReviews.length
    }
  });
});

app.get("/api/db-agent/examples", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    success: true,
    examples: [
      {
        category: "Pricing & Budget",
        query: "Find all audio products under $100 with rating above 4.5",
        description: "Filters products by category, price threshold, and star rating."
      },
      {
        category: "Historical Era",
        query: "Show me all 1950s products",
        description: "Discovers vintage artifacts produced in or inspired by the 1950s."
      },
      {
        category: "Aggregations & Analytics",
        query: "Average price by category",
        description: "Executes a MongoDB $group aggregation pipeline."
      },
      {
        category: "Ranking & Luxury",
        query: "Top 3 most expensive cameras",
        description: "Finds high-end photography gear sorted by price."
      },
      {
        category: "Account & Metrics",
        query: "How many users are registered?",
        description: "Executes a countDocuments() query on the users collection."
      },
      {
        category: "Customer Feedback",
        query: "Reviews with 5 stars",
        description: "Queries high-satisfaction reviews from antique collectors."
      }
    ]
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});