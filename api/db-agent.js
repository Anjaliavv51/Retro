const { processDbAgentQuery, SCHEMA_CATALOG } = require('../backend/agent/dbAgent.js');
const { defaultProducts, defaultReviews, defaultUsers } = require('../backend/config/seedData.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.originalUrl || req.url || '';
  const action = req.query?.action || '';

  // 1. Stats endpoint
  if (path.includes('/stats') || action === 'stats') {
    return res.status(200).json({
      success: true,
      status: 'online',
      connection: {
        host: 'Vercel Serverless Edge',
        database: 'Retro In-Memory & Atlas Cache',
        readyState: 1
      },
      counts: {
        products: defaultProducts.length,
        users: defaultUsers.length,
        reviews: defaultReviews.length
      }
    });
  }

  // 2. Schema catalog
  if (path.includes('/schema') || action === 'schema') {
    return res.status(200).json({
      success: true,
      schemas: SCHEMA_CATALOG
    });
  }

  // 3. Examples
  if (path.includes('/examples') || action === 'examples') {
    return res.status(200).json({
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
  }

  // 4. Default: Natural Language Query Processor
  try {
    const naturalQuery = req.method === 'GET'
      ? (req.query.q || req.query.query || '')
      : (req.body ? (req.body.q || req.body.query || '') : '');

    if (!naturalQuery || !naturalQuery.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required. Provide ?q=... or JSON { query: "..." }'
      });
    }

    const result = await processDbAgentQuery(naturalQuery.trim());
    return res.status(200).json(result);
  } catch (err) {
    console.error('[Vercel DbAgent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Database Agent query failed: ' + err.message
    });
  }
};
