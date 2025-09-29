const { ZodError } = require('zod');
module.exports = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({ body: req.body, query: req.query, params: req.params });
    req.body = parsed.body; req.query = parsed.query; req.params = parsed.params;
    next();
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).json({ message: 'Validation error', issues: e.issues });
    next(e);
  }
};
