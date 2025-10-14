// src/server.js
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

// adapt to your project structure:
const { sequelize } = require('../models'); // Sequelize connection
const mongodb = require('./mongodb'); // MongoDB connection helper

// ---------- build whitelist from env ----------
const WHITELIST = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean); // e.g. "http://localhost:8080,https://example.com"

// ---------- CORS options ----------
const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser (curl/postman) requests which have no origin
    if (!origin) return callback(null, true);

    // if no whitelist configured, allow all origins (only for local/dev convenience)
    if (WHITELIST.length === 0) return callback(null, true);

    if (WHITELIST.includes(origin)) return callback(null, true);

    // otherwise block
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // enable Access-Control-Allow-Credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// ---------- create app & middleware ----------
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ---------- apply CORS globally (must be before routes) ----------
app.use(cors(corsOptions));

// Use RegExp for preflight to avoid path-to-regexp string parsing issues
// This returns the proper CORS headers for preflight requests.
app.options(/.*/, cors(corsOptions));

// ---------- fallback explicit preflight responder (optional) ----------
// If you need absolute control over preflight responses, keep this:
// it sets Access-Control-Allow-* headers explicitly based on incoming Origin.
app.options(/.*/, (req, res) => {
  const origin = req.headers.origin;
  if (!origin || WHITELIST.length === 0 || WHITELIST.includes(origin)) {
    // Set explicit headers (never set '*' when credentials are used)
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    res.setHeader('Vary', 'Origin'); // recommend for caches/proxies
    return res.sendStatus(204);
  }
  return res.sendStatus(403);
});

// ---------- static files (if needed) ----------
// app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------- example API route(s) ----------
// Load your routes (ensure these route files do NOT import server.js back)
app.use('/api', require('./routes/allroutes'));

// Example analytics endpoint you referenced — demonstrates cookie + CORS
app.post('/api/visit', (req, res) => {
  // set a cookie usable in cross-site contexts (SameSite=None + Secure)
  // NOTE: secure: true requires your API to be served over HTTPS in production
  res.cookie('visitorId', 'visitor-' + Date.now(), {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
  });

  // respond with a sample VisitResponse shape
  res.json({
    counted: true,
    newVisitorCookie: true,
    page: req.body.page || null,
    uniqueForPage: 1,
    uniqueTotal: 1
  });
});

// ---------- MongoDB connection ----------
try {
  if (mongodb && typeof mongodb.connect === 'function') {
    mongodb.connect().catch(err => {
      console.error('MongoDB connect error', err);
    });
  }
} catch (err) {
  console.warn('mongodb.connect skipped or failed sync', err);
}

// ---------- Sequelize connection and start server ----------
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize DB connected');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  } catch (e) {
    console.error('DB connect failed', e);
    process.exit(1);
  }
})();

module.exports = app;
