const { searchRAG } = require('./ragSearchEngine.cjs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const query = req.method === 'GET' 
      ? (req.query.q || req.query.query || '') 
      : (req.body && (req.body.q || req.body.query) || '');

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required. Provide ?q=... or JSON body { query: "..." }'
      });
    }

    const topK = parseInt(req.method === 'GET' ? req.query.limit : (req.body && req.body.limit), 10) || 4;
    const result = await searchRAG(query.trim(), topK);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[API rag-search error]:', err);
    return res.status(500).json({
      success: false,
      error: 'RAG search error: ' + err.message
    });
  }
};
