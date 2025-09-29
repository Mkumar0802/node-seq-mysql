const express = require('express');
const app = express();

app.use(express.json());

const productsRouter = require('./routes/products.routes'); // should be a function
app.use('/api/v1/products', productsRouter);

app.get('/health', (_, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
