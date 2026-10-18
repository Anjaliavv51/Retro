const express = require('express');
const dbAgentRouter = express.Router();

const {
  handleDbQuery,
  getDbSchema,
  getDbStats,
  getDbExamples
} = require('../controller/dbAgentController.js');

// Natural Language Query Endpoints (Supports both GET & POST)
dbAgentRouter.post('/query', handleDbQuery);
dbAgentRouter.get('/query', handleDbQuery);

// Metadata & Introspection
dbAgentRouter.get('/schema', getDbSchema);
dbAgentRouter.get('/stats', getDbStats);
dbAgentRouter.get('/examples', getDbExamples);

module.exports = dbAgentRouter;
