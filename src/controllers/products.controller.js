// src/controllers/products.controller.js
const { Op } = require('sequelize');
const { Product } = require('../../models');

const parsePagination = (q) => {
  const page = Math.max(1, Number(q.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 10));
  return { page, pageSize, offset: (page - 1) * pageSize, limit: pageSize };
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page, pageSize } = parsePagination(req.query);
    const where = {};
    if (req.query.q) where.name = { [Op.like]: `%${req.query.q}%` }; // MySQL collation decides case-sensitivity
    const { rows, count } = await Product.findAndCountAll({
      where, limit, offset, order: [['createdAt','DESC']]
    });
    res.json({
      data: rows,
      meta: {
        total: count, page, pageSize,
        totalPages: Math.max(1, Math.ceil(count / pageSize)),
        hasPrev: page > 1, hasNext: page * pageSize < count
      }
    });
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    await product.update(req.body);
    res.json(product);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
};
