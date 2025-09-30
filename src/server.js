require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { sequelize } = require('../models'); // Sequelize model connection
const mongodb = require('./mongodb'); // MongoDB connection setup
const logger = require('morgan'); // Logger middleware
const path = require('path'); // Path module for static files
const cookieParser = require('cookie-parser'); // Cookie parser middleware

// Initialize the app
const app = express();

// Set the port from environment variables or default to 4000
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(logger('dev')); // Log all HTTP requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies in the request

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// API routes (assuming you have the routes defined in './routes/allroutes')
app.use('/api', require('./routes/allroutes'));

// MongoDB connection
mongodb.connect(); // Connect to MongoDB

// Sequelize connection and server start
(async () => {
  try {
    // Authenticate Sequelize (SQL) connection
    await sequelize.authenticate();
    console.log('DB connected'); // Log if Sequelize connects successfully

    // Start the server after DB connection is established
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (e) {
    console.error('DB connect failed', e); // Log any errors
    process.exit(1); // Exit the process if DB connection fails
  }
})();
