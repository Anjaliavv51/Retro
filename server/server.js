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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});