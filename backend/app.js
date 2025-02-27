const express = require('express');
const app = express();

const authRouter = require('./router/authRoute.js');
const databaseconnect = require('./config/databaseConfig.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const productRouter = require("./router/productRoute.js"); 

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
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));

// Expose CSRF token to client
app.get('/csrf-token', csrfProtect, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth routes
app.use('/api/auth', csrfProtect, limiter, authRouter);
app.use("/api/products", productRouter);

// Global error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = app;
