// Validates product ID param (can be MongoDB ObjectId or a valid slug)
export const validateProductId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid product identifier provided',
    });
  }

  req.params.id = id.trim();
  next();
};

// Validates product filter query parameters
export const validateProductQuery = (req, res, next) => {
  const { minPrice, maxPrice, minRating, page, limit } = req.query;

  if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter "minPrice" must be a positive number',
    });
  }

  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter "maxPrice" must be a positive number',
    });
  }

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({
      success: false,
      message: '"minPrice" cannot be greater than "maxPrice"',
    });
  }

  if (minRating && (isNaN(Number(minRating)) || Number(minRating) < 0 || Number(minRating) > 5)) {
    return res.status(400).json({
      success: false,
      message: '"minRating" must be between 0 and 5',
    });
  }

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: '"page" must be a positive integer starting from 1',
    });
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: '"limit" must be between 1 and 100',
    });
  }

  next();
};

// Validates stock check request body
export const validateStockCheck = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Missing "productId" in request body',
    });
  }

  if (quantity !== undefined && (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'Requested "quantity" must be a positive integer greater than 0',
    });
  }

  next();
};
