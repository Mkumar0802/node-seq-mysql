// src/routes/products.routes.js
const express = require('express');
const z = require('zod');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/products.controller');

const router = express.Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().min(0),
    description: z.string().optional()
  }),
  query: z.object({}).passthrough(),
  params: z.object({})
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    price: z.coerce.number().nonnegative().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    description: z.string().optional()
  }),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.string() })
});

// CRUD routes (single definitions only)
router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.get);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router; // IMPORTANT: export the router function
