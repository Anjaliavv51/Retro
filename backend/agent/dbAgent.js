/**
 * Retro Natural Language Database Query Agent
 * Translates English natural language queries into safe MongoDB Query Language (MQL)
 * and executes them with full read-only security guardrails.
 */

const mongoose = require('mongoose');
const { defaultProducts, defaultReviews, defaultUsers } = require('../config/seedData.js');

// Lazy-load models
let productModel;
let reviewModel;
let userModel;

function getModels() {
  if (!productModel) {
    try {
      productModel = require('../model/productSchema.js');
    } catch (e) {
      // fallback if required outside backend root
    }
  }
  if (!reviewModel) {
    try {
      reviewModel = require('../model/reviewSchema.js');
    } catch (e) {}
  }
  if (!userModel) {
    try {
      userModel = require('../model/userSchema.js');
    } catch (e) {}
  }
  return { Product: productModel, Review: reviewModel, User: userModel };
}

// Schemas & Catalog Definitions for Context
const SCHEMA_CATALOG = {
  products: {
    description: "Vintage catalog items (audio, typewriters, cameras, telephony, decor)",
    fields: {
      id: "String (unique identifier, e.g. 'prod-1')",
      title: "String (product title)",
      category: "String (e.g. 'Audio & Music', 'Photography', 'Writing & Office', 'Telephony')",
      era: "String (e.g. '1920s', '1940s', '1950s', '1960s')",
      price: "String (formatted, e.g. '$299.99')",
      price_num: "Number (numeric price for sorting/filtering, e.g. 299.99)",
      rating: "Number (1.0 to 5.0 score)",
      image: "String (path or URL)",
      tag: "String (e.g. 'Best Seller', 'Featured', 'Limited Edition')",
      description: "String (historical details, provenance, and specifications)",
      aesthetic: "String (e.g. 'Mid-Century Modern', 'Art Deco')",
      stock: "Number (available inventory)"
    }
  },
  users: {
    description: "Registered user accounts (sensitive fields like passwords are strictly masked)",
    fields: {
      name: "String (full name)",
      email: "String (user email address)",
      createdAt: "Date (registration timestamp)",
      updatedAt: "Date (last profile update)"
    }
  },
  reviews: {
    description: "Verified customer reviews and feedback for vintage pieces",
    fields: {
      name: "String (reviewer name)",
      rating: "Number (1 to 5 stars)",
      comment: "String (feedback text)",
      date: "String (YYYY-MM-DD format)"
    }
  }
};

/**
 * Natural Language Parser (Deterministic Text-to-MQL Engine)
 */
function parseNaturalQuery(query) {
  const qLower = query.toLowerCase().trim();

  // 1. Target Collection Detection
  let collection = 'products';
  if (/\b(user|users|account|accounts|customer|customers|registered|signup|member|members)\b/i.test(qLower)) {
    collection = 'users';
  } else if (/\b(review|reviews|feedback|rating|ratings|comment|comments|testimonial)\b/i.test(qLower) && 
             !/\b(product|item|camera|gramophone|audio|typewriter)\b/i.test(qLower)) {
    collection = 'reviews';
  }

  // 2. Query Type: Count, Aggregate (Group by), or Find
  const isCount = /\b(how many|count|total number of|number of)\b/i.test(qLower) && !/\b(by|group)\b/i.test(qLower);
  const isAggregate = /\b(average|avg|group by|grouped by|per category|per era|by category|by era)\b/i.test(qLower);

  let filter = {};
  let sort = {};
  let limit = 20;

  // 3. Extract Limits ("top 5", "limit 10", "first 3")
  const limitMatch = qLower.match(/\b(top|first|limit)\s+(\d+)\b/);
  if (limitMatch) {
    limit = Math.min(parseInt(limitMatch[2], 10), 50);
  }

  // 4. Products Specific Parsing
  if (collection === 'products') {
    // Price Filters
    const underPrice = qLower.match(/\b(under|less than|below|cheaper than|<)\s*\$?(\d+(?:\.\d+)?)\b/);
    const abovePrice = qLower.match(/\b(above|more than|greater than|over|>)\s*\$?(\d+(?:\.\d+)?)\b/);
    const betweenPrice = qLower.match(/\b(between)\s*\$?(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?(\d+(?:\.\d+)?)\b/);

    if (betweenPrice) {
      filter.price_num = { $gte: parseFloat(betweenPrice[2]), $lte: parseFloat(betweenPrice[3]) };
    } else if (underPrice) {
      filter.price_num = { $lte: parseFloat(underPrice[2]) };
    } else if (abovePrice) {
      filter.price_num = { $gte: parseFloat(abovePrice[2]) };
    }

    // Rating Filters
    const ratingMatch = qLower.match(/\b(?:rating|rated|stars?)\s*(?:above|>=|>|over|at least)?\s*(\d(?:\.\d)?)\b/);
    if (ratingMatch) {
      filter.rating = { $gte: parseFloat(ratingMatch[1]) };
    } else if (/\b(5 stars?|top rated|highest rated|5\/5)\b/i.test(qLower)) {
      filter.rating = { $gte: 4.8 };
    }

    // Era Filters
    const eras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', 'victorian', 'art deco', 'mid-century'];
    for (const era of eras) {
      if (qLower.includes(era)) {
        filter.$or = [
          { era: new RegExp(era, 'i') },
          { aesthetic: new RegExp(era, 'i') },
          { description: new RegExp(era, 'i') }
        ];
        break;
      }
    }

    // Category Filters
    const categories = [
      { key: 'audio', match: /\b(audio|music|gramophones?|radios?|phonographs?|vinyls?|sounds?|records?)\b/i, val: 'Audio' },
      { key: 'photography', match: /\b(photos?|photography|cameras?|lens(?:es)?|rangefinders?|film)\b/i, val: 'Photography' },
      { key: 'writing', match: /\b(writing|writers?|typewriters?|office|mechanical typewriter)\b/i, val: 'Office' },
      { key: 'telephony', match: /\b(phones?|telephones?|rotary|telephony)\b/i, val: 'Telephony' },
      { key: 'decor', match: /\b(decor|carpets?|rugs?|clocks?|collectibles?|lamps?)\b/i, val: 'Decor' }
    ];

    for (const cat of categories) {
      if (cat.match.test(qLower)) {
        if (!filter.$or) {
          filter.category = new RegExp(cat.val, 'i');
        }
        break;
      }
    }

    // Tag Filters
    if (/\bbest sellers?\b/i.test(qLower)) {
      filter.tag = /best seller/i;
    } else if (/\bfeatured\b/i.test(qLower)) {
      filter.tag = /featured/i;
    } else if (/\blimited edition\b/i.test(qLower)) {
      filter.tag = /limited edition/i;
    }

    // Sort order
    if (/\b(cheapest|lowest price|price low to high|budget)\b/i.test(qLower)) {
      sort = { price_num: 1 };
    } else if (/\b(most expensive|highest price|luxury|premium)\b/i.test(qLower)) {
      sort = { price_num: -1 };
    } else if (/\b(highest rated|top rated|best rated|popular)\b/i.test(qLower)) {
      sort = { rating: -1 };
    } else if (/\b(newest|recent|latest)\b/i.test(qLower)) {
      sort = { createdAt: -1 };
    }
  }

  // 5. Users Specific Parsing
  if (collection === 'users') {
    if (/\b(admin|curator)\b/i.test(qLower)) {
      filter.role = 'curator';
    }
    if (/\b(today|recent|new)\b/i.test(qLower)) {
      sort = { createdAt: -1 };
    }
  }

  // 6. Reviews Specific Parsing
  if (collection === 'reviews') {
    const starMatch = qLower.match(/(\d)\s*stars?/);
    if (starMatch) {
      filter.rating = parseInt(starMatch[1], 10);
    } else if (/\b(positive|5 star|excellent)\b/i.test(qLower)) {
      filter.rating = { $gte: 4 };
    }
    sort = { rating: -1 };
  }

  // Aggregation Pipelines (e.g. Average price by category, count by category)
  let pipeline = null;
  if (isAggregate) {
    if (/\b(price|avg price|average price)\b/i.test(qLower)) {
      pipeline = [
        {
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price_num" },
            minPrice: { $min: "$price_num" },
            maxPrice: { $max: "$price_num" },
            totalItems: { $sum: 1 }
          }
        },
        { $sort: { averagePrice: -1 } }
      ];
    } else if (/\b(era)\b/i.test(qLower)) {
      pipeline = [
        {
          $group: {
            _id: "$era",
            itemCount: { $sum: 1 },
            averageRating: { $avg: "$rating" }
          }
        },
        { $sort: { itemCount: -1 } }
      ];
    } else {
      pipeline = [
        {
          $group: {
            _id: "$category",
            itemCount: { $sum: 1 },
            averageRating: { $avg: "$rating" }
          }
        },
        { $sort: { itemCount: -1 } }
      ];
    }
  }

  return {
    collection,
    queryType: isCount ? 'count' : (isAggregate ? 'aggregate' : 'find'),
    filter,
    sort,
    limit,
    pipeline
  };
}

/**
 * Format MongoDB shell command representation (MQL)
 */
function buildMQLString(parsed) {
  const { collection, queryType, filter, sort, limit, pipeline } = parsed;
  
  if (queryType === 'count') {
    return Object.keys(filter).length > 0
      ? `db.${collection}.countDocuments(${formatJsonForMQL(filter)})`
      : `db.${collection}.countDocuments()`;
  }

  if (queryType === 'aggregate') {
    return `db.${collection}.aggregate(${JSON.stringify(pipeline, null, 2)})`;
  }

  let code = `db.${collection}.find(${formatJsonForMQL(filter)})`;
  if (collection === 'users') {
    code += `.project({ password: 0, forgotPasswordToken: 0, forgotPasswordExpiryDate: 0 })`;
  }
  if (Object.keys(sort).length > 0) {
    code += `.sort(${JSON.stringify(sort)})`;
  }
  if (limit) {
    code += `.limit(${limit})`;
  }
  return code;
}

function formatJsonForMQL(obj) {
  if (Object.keys(obj).length === 0) return '{}';
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof RegExp) {
      return value.toString();
    }
    return value;
  }, 2);
}

/**
 * In-Memory MQL query engine for local offline execution / fallback
 */
function executeInMemoryQuery(parsed) {
  const { collection, queryType, filter, sort, limit, pipeline } = parsed;
  let dataset = [];

  if (collection === 'products') dataset = [...defaultProducts];
  else if (collection === 'users') dataset = [...defaultUsers];
  else if (collection === 'reviews') dataset = [...defaultReviews];

  // Aggregation handling
  if (queryType === 'aggregate' && pipeline) {
    const groupStage = pipeline.find(s => s.$group);
    if (groupStage) {
      const groupField = groupStage.$group._id.replace('$', '');
      const groups = {};

      dataset.forEach(item => {
        const key = item[groupField] || 'Uncategorized';
        if (!groups[key]) {
          groups[key] = { _id: key, count: 0, prices: [], ratings: [] };
        }
        groups[key].count++;
        if (item.price_num) groups[key].prices.push(item.price_num);
        if (item.rating) groups[key].ratings.push(item.rating);
      });

      let results = Object.values(groups).map(g => {
        const res = { _id: g._id, totalItems: g.count, itemCount: g.count };
        if (g.prices.length > 0) {
          const sum = g.prices.reduce((a, b) => a + b, 0);
          res.averagePrice = Math.round((sum / g.prices.length) * 100) / 100;
          res.minPrice = Math.min(...g.prices);
          res.maxPrice = Math.max(...g.prices);
        }
        if (g.ratings.length > 0) {
          const sum = g.ratings.reduce((a, b) => a + b, 0);
          res.averageRating = Math.round((sum / g.ratings.length) * 10) / 10;
        }
        return res;
      });

      return {
        results,
        count: results.length,
        executionMode: 'In-Memory MQL Engine (Offline / Instant)'
      };
    }
  }

  // Filter application
  let filtered = dataset.filter(item => {
    for (const [key, cond] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(cond)) {
        const matchesAny = cond.some(subCond => {
          for (const [subKey, subVal] of Object.entries(subCond)) {
            const val = item[subKey];
            if (subVal instanceof RegExp) {
              if (!subVal.test(String(val || ''))) return false;
            } else if (val !== subVal) {
              return false;
            }
          }
          return true;
        });
        if (!matchesAny) return false;
        continue;
      }

      const val = item[key];
      if (cond instanceof RegExp) {
        if (!cond.test(String(val || ''))) return false;
      } else if (typeof cond === 'object' && cond !== null) {
        if (cond.$gte !== undefined && val < cond.$gte) return false;
        if (cond.$lte !== undefined && val > cond.$lte) return false;
        if (cond.$gt !== undefined && val <= cond.$gt) return false;
        if (cond.$lt !== undefined && val >= cond.$lt) return false;
      } else if (val !== cond) {
        return false;
      }
    }
    return true;
  });

  if (queryType === 'count') {
    return {
      results: [{ count: filtered.length, target: collection }],
      count: filtered.length,
      executionMode: 'In-Memory MQL Engine (Offline / Instant)'
    };
  }

  // Sort
  if (sort && Object.keys(sort).length > 0) {
    const [sortField, sortDir] = Object.entries(sort)[0];
    filtered.sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortDir === 1 ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }

  // Limit & Sanitization
  const results = filtered.slice(0, limit || 20).map(item => {
    const clean = { ...item };
    delete clean.password;
    delete clean.forgotPasswordToken;
    delete clean.forgotPasswordExpiryDate;
    return clean;
  });

  return {
    results,
    count: results.length,
    executionMode: 'In-Memory MQL Engine (Offline / Instant)'
  };
}

/**
 * Execute MQL query against live MongoDB via Mongoose
 */
async function executeMongoQuery(parsed) {
  const { Product, Review, User } = getModels();
  const { collection, queryType, filter, sort, limit, pipeline } = parsed;

  let model;
  if (collection === 'products') model = Product;
  else if (collection === 'users') model = User;
  else if (collection === 'reviews') model = Review;

  if (!model) {
    throw new Error(`Collection ${collection} not configured in Mongoose models.`);
  }

  if (queryType === 'count') {
    const count = await model.countDocuments(filter);
    return {
      results: [{ count, target: collection }],
      count,
      executionMode: 'Live MongoDB (Mongoose)'
    };
  }

  if (queryType === 'aggregate' && pipeline) {
    const results = await model.aggregate(pipeline);
    return {
      results,
      count: results.length,
      executionMode: 'Live MongoDB (Mongoose)'
    };
  }

  // Find query
  let queryBuilder = model.find(filter);
  if (collection === 'users') {
    queryBuilder = queryBuilder.select('-password -forgotPasswordToken -forgotPasswordExpiryDate');
  }
  if (sort && Object.keys(sort).length > 0) {
    queryBuilder = queryBuilder.sort(sort);
  }
  if (limit) {
    queryBuilder = queryBuilder.limit(limit);
  }

  const results = await queryBuilder.lean().exec();
  return {
    results,
    count: results.length,
    executionMode: 'Live MongoDB (Mongoose)'
  };
}

/**
 * Generate human-friendly narrative summary
 */
function generateNarrative(query, parsed, queryResult) {
  const { collection, queryType, filter } = parsed;
  const count = queryResult.count;

  if (queryType === 'count') {
    return `Found a total count of **${count}** records in the **${collection}** collection matching your criteria.`;
  }

  if (queryType === 'aggregate') {
    return `Successfully performed MongoDB aggregation across **${collection}**, grouping records into **${count}** statistical categories.`;
  }

  if (count === 0) {
    return `No records matched your query in **${collection}**. Try broadening your price, era, or category filters.`;
  }

  let filterDesc = [];
  if (filter.price_num) {
    if (filter.price_num.$lte) filterDesc.push(`priced up to $${filter.price_num.$lte}`);
    if (filter.price_num.$gte) filterDesc.push(`priced at or above $${filter.price_num.$gte}`);
  }
  if (filter.rating) {
    if (filter.rating.$gte) filterDesc.push(`rated ≥ ${filter.rating.$gte} stars`);
  }
  if (filter.category) {
    filterDesc.push(`in category matching "${filter.category.source || filter.category}"`);
  }

  const criteriaText = filterDesc.length > 0 ? ` (${filterDesc.join(', ')})` : '';
  return `Retrieved **${count}** records from **${collection}**${criteriaText}, sorted and ready.`;
}

/**
 * Main Agent Entrypoint
 */
async function processDbAgentQuery(naturalQuery) {
  if (!naturalQuery || !naturalQuery.trim()) {
    throw new Error('Please provide a natural language query.');
  }

  const startTime = Date.now();
  const parsed = parseNaturalQuery(naturalQuery.trim());
  const mqlString = buildMQLString(parsed);

  let queryOutput;
  const isMongoReady = mongoose.connection && mongoose.connection.readyState === 1;

  if (isMongoReady) {
    try {
      queryOutput = await executeMongoQuery(parsed);
    } catch (dbErr) {
      console.warn('[DbAgent] Live MongoDB query failed, using in-memory engine fallback:', dbErr.message);
      queryOutput = executeInMemoryQuery(parsed);
      queryOutput.executionMode += ` (Fallback due to: ${dbErr.message})`;
    }
  } else {
    queryOutput = executeInMemoryQuery(parsed);
  }

  const latencyMs = Date.now() - startTime;
  const narrative = generateNarrative(naturalQuery, parsed, queryOutput);

  return {
    success: true,
    naturalQuery: naturalQuery.trim(),
    targetCollection: parsed.collection,
    queryType: parsed.queryType,
    generatedMQL: mqlString,
    parsedFilter: parsed.filter,
    count: queryOutput.count,
    results: queryOutput.results,
    narrative,
    metadata: {
      latencyMs,
      dbStatus: isMongoReady ? 'Connected (Live MongoDB)' : 'Offline / In-Memory Seed Mode',
      executionMode: queryOutput.executionMode
    }
  };
}

module.exports = {
  processDbAgentQuery,
  parseNaturalQuery,
  buildMQLString,
  SCHEMA_CATALOG
};
