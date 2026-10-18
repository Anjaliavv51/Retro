// Node.js 26+ compatibility polyfill for legacy dependencies
const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
if (typeof SlowBuffer === 'undefined') {
  global.SlowBuffer = bufferModule.Buffer;
}

const express = require('express');
const app = express();

const authRouter = require('./router/authRoute.js');
const dbAgentRouter = require('./router/dbAgentRoute.js');
const databaseconnect = require('./config/databaseConfig.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

// Initialize CSRF Protection
const csrfProtect = csrf({ cookie: true });

// Define a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Connect to DB
databaseconnect();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Expose CSRF token to client
app.get('/csrf-token', csrfProtect, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth routes
app.use('/api/auth', csrfProtect, limiter, authRouter);

// Retro AI Database Agent routes
app.use('/api/db-agent', limiter, dbAgentRouter);

// Global error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = app;
