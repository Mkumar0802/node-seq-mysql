// src/routes/analytics.js
const express = require('express');
const { Visit, Visitor } = require('../models/Visit');
const { v4: uuidv4 } = require('uuid');

// --- isbot require + normalization (replace any existing isbot require) ---
let isbot;
try {
  // Try to load the isbot package (recommended: install it with `npm i isbot`)
  isbot = require('isbot');

  // Some environments (bundlers / ESM interop) return { default: fn }
  if (typeof isbot !== 'function' && isbot && typeof isbot.default === 'function') {
    isbot = isbot.default;
  }

  // If it's still not a function, fallback to a simple check below
  if (typeof isbot !== 'function') {
    throw new Error('isbot not a function');
  }
} catch (e) {
  // Fallback simple bot-check (keeps dev from crashing if isbot isn't installed)
  const BOT_UA_RE = /(bot|crawler|spider|crawling|mediapartners-google|adsbot|bingbot|slurp|duckduckgo|baiduspider)/i;
  isbot = (ua) => {
    if (!ua) return false;
    return BOT_UA_RE.test(ua);
  };
}


const COOKIE_NAME = process.env.VISITOR_COOKIE_NAME || 'visitorId';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 2; // 2 years

// ------------------------------
// Helpers & middleware
// ------------------------------
function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim() || req.socket.remoteAddress;
}

/**
 * visitTracker middleware:
 * - sets visitor cookie if missing
 * - records/upserts visitor and page visit (unique per page+visitor)
 * - attaches result as req.analytics
 */
async function visitTracker(req, res, next) {
  try {
    const ua = req.get('user-agent') || '';

    // Skip bots
    if (isbot(ua)) {
      req.analytics = { counted: false, reason: 'bot' };
      return next();
    }

    let visitorId = req.cookies && req.cookies[COOKIE_NAME];
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = uuidv4();
      isNewVisitor = true;
      res.cookie(COOKIE_NAME, visitorId, {
        httpOnly: false,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    // prefer explicit page in body, otherwise use originalUrl
    const page = req.body?.page || req.originalUrl || '/';

    // upsert visitor (site-wide)
    await Visitor.updateOne(
      { visitorId },
      { $setOnInsert: { firstSeen: new Date() }, $set: { lastSeen: new Date() } },
      { upsert: true }
    );

    let counted = false;
    try {
      await Visit.create({
        visitorId,
        page,
        userAgent: ua,
        ip: getClientIp(req),
      });
      counted = true;
    } catch (err) {
      // duplicate key => already counted for this page
      if (err && err.code === 11000) {
        counted = false;
      } else {
        console.error('visitTracker: Visit.create error', err);
      }
    }

    const [uniqueForPage, uniqueTotal] = await Promise.all([
      Visit.countDocuments({ page }),
      Visitor.countDocuments({}),
    ]);

    req.analytics = {
      counted,
      newVisitorCookie: isNewVisitor,
      page,
      uniqueForPage,
      uniqueTotal,
    };

    return next();
  } catch (err) {
    console.error('visitTracker error', err);
    return next(); // do not block request on analytics failure
  }
}

// ------------------------------
// Controller-like functions
// ------------------------------
async function recordVisit(req, res) {
  // You can use the middleware visitTracker before recordVisit,
  // or call this endpoint directly (it contains its own logic).
  try {
    const ua = req.get('user-agent') || '';
    if (isbot(ua)) return res.json({ counted: false, reason: 'bot' });

    let visitorId = req.cookies && req.cookies[COOKIE_NAME];
    let isNewVisitor = false;
    if (!visitorId) {
      visitorId = uuidv4();
      isNewVisitor = true;
      res.cookie(COOKIE_NAME, visitorId, {
        httpOnly: false,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    const page = req.body?.page || req.get('referer') || '/';

    await Visitor.updateOne(
      { visitorId },
      { $setOnInsert: { firstSeen: new Date() }, $set: { lastSeen: new Date() } },
      { upsert: true }
    );

    let counted = false;
    try {
      await Visit.create({
        visitorId,
        page,
        userAgent: ua,
        ip: getClientIp(req),
      });
      counted = true;
    } catch (err) {
      if (err && err.code === 11000) counted = false;
      else console.error('recordVisit: Visit.create error', err);
    }

    const uniqueForPage = await Visit.countDocuments({ page });
    const uniqueTotal = await Visitor.countDocuments({});

    return res.json({
      counted,
      newVisitorCookie: isNewVisitor,
      page,
      uniqueForPage,
      uniqueTotal,
    });
  } catch (err) {
    console.error('recordVisit error', err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function getPageStats(req, res) {
  try {
    const page = req.query.page || '/';
    const uniqueForPage = await Visit.countDocuments({ page });
    return res.json({ page, uniqueForPage });
  } catch (err) {
    console.error('getPageStats error', err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function getTotalStats(req, res) {
  try {
    const uniqueTotal = await Visitor.countDocuments({});
    return res.json({ uniqueTotal });
  } catch (err) {
    console.error('getTotalStats error', err);
    return res.status(500).json({ error: 'server error' });
  }
}

// ------------------------------
// Router creation
// ------------------------------
function createRouter() {
  const router = express.Router();

  // If you'd like the middleware to run before the route handler, attach it here:
  // router.post('/visit', visitTracker, recordVisit);
  // But we'll keep recordVisit self-contained so frontend can call POST /api/visit directly
  router.post('/visit', recordVisit);
  router.get('/stats/page', getPageStats);
  router.get('/stats/total', getTotalStats);

  return router;
}

// ------------------------------
// Exports
// ------------------------------
module.exports = {
  createRouter,
  getClientIp,
  visitTracker,
  recordVisit,
  getPageStats,
  getTotalStats,
};
