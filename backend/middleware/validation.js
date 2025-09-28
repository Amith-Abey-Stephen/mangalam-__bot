export const validateQuery = (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      error: 'Query is required',
      message: 'Please provide a question or query to search for.'
    });
  }

  if (typeof query !== 'string') {
    return res.status(400).json({
      error: 'Invalid query format',
      message: 'Query must be a string.'
    });
  }

  if (query.trim().length === 0) {
    return res.status(400).json({
      error: 'Empty query',
      message: 'Query cannot be empty.'
    });
  }

  if (query.length > 1000) {
    return res.status(400).json({
      error: 'Query too long',
      message: 'Query must be less than 1000 characters.'
    });
  }

  // Sanitize query
  req.body.query = query.trim();
  next();
};