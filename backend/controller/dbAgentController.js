const { processDbAgentQuery, SCHEMA_CATALOG } = require('../agent/dbAgent.js');
const mongoose = require('mongoose');
const { defaultProducts, defaultReviews, defaultUsers } = require('../config/seedData.js');

let ProductModel;
let UserModel;
let ReviewModel;

try {
  ProductModel = require('../model/productSchema.js');
  UserModel = require('../model/userSchema.js');
  ReviewModel = require('../model/reviewSchema.js');
} catch (e) {}

/**
 * Handle Natural Language Database Query
 * POST /api/db-agent/query
 * GET  /api/db-agent/query?q=...
 */
const handleDbQuery = async (req, res) => {
  try {
    const naturalQuery = req.method === 'GET'
      ? (req.query.q || req.query.query || '')
      : (req.body.q || req.body.query || '');

    if (!naturalQuery || !naturalQuery.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Natural language query is required. Provide ?q=... or JSON { query: "..." }'
      });
    }

    const agentResult = await processDbAgentQuery(naturalQuery.trim());
    return res.status(200).json(agentResult);
  } catch (error) {
    console.error('[DbAgentController Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process natural language database query: ' + error.message
    });
  }
};

/**
 * Get Database Schema Catalog
 * GET /api/db-agent/schema
 */
const getDbSchema = (req, res) => {
  return res.status(200).json({
    success: true,
    schemas: SCHEMA_CATALOG
  });
};

/**
 * Get Database Health & Statistics
 * GET /api/db-agent/stats
 */
const getDbStats = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection && mongoose.connection.readyState === 1;

    let productCount = defaultProducts.length;
    let userCount = defaultUsers.length;
    let reviewCount = defaultReviews.length;

    if (isMongoConnected) {
      if (ProductModel) productCount = await ProductModel.countDocuments();
      if (UserModel) userCount = await UserModel.countDocuments();
      if (ReviewModel) reviewCount = await ReviewModel.countDocuments();
    }

    return res.status(200).json({
      success: true,
      status: isMongoConnected ? 'online' : 'offline_fallback',
      connection: {
        host: isMongoConnected ? mongoose.connection.host : 'localhost (in-memory mode)',
        database: isMongoConnected ? mongoose.connection.name : 'Retro Local Cache',
        readyState: isMongoConnected ? 1 : 0
      },
      counts: {
        products: productCount,
        users: userCount,
        reviews: reviewCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve database stats: ' + error.message
    });
  }
};

/**
 * Get Sample Questions for Quick Start
 * GET /api/db-agent/examples
 */
const getDbExamples = (req, res) => {
  const examples = [
    {
      category: "Pricing & Budget",
      query: "Find all audio products under $100 with rating above 4.5",
      description: "Filters products by category, upper price bound, and minimum rating."
    },
    {
      category: "Historical Era",
      query: "Show me all 1950s products",
      description: "Discovers vintage artifacts produced in or inspired by the 1950s."
    },
    {
      category: "Aggregations & Analytics",
      query: "Average price by category",
      description: "Executes a MongoDB $group aggregation pipeline for market analytics."
    },
    {
      category: "Ranking & Luxury",
      query: "Top 3 most expensive cameras",
      description: "Combines category filtering, descending price sort, and limit."
    },
    {
      category: "Account & Metrics",
      query: "How many users are registered?",
      description: "Executes a safe countDocuments() across the users collection."
    },
    {
      category: "Customer Feedback",
      query: "Reviews with 5 stars",
      description: "Queries high-satisfaction verified feedback from antique collectors."
    }
  ];

  return res.status(200).json({
    success: true,
    examples
  });
};

module.exports = {
  handleDbQuery,
  getDbSchema,
  getDbStats,
  getDbExamples
};
