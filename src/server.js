require('dotenv').config();
const app = require('./app');
const { sequelize } = require('../models');
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (e) {
    console.error('DB connect failed', e);
    process.exit(1);
  }
})();






