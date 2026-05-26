const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

// Attach decoded token to req.user
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401);
  }
  try {
    req.user = verifyToken(header.split(' ')[1]);
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
};

// Allow only users with role === 'merchant'
const isMerchant = (req, res, next) => {
  if (req.user?.role !== 'merchant') {
    return error(res, 'Access denied: merchants only', 403);
  }
  next();
};

// Allow only users with role === 'user'
const isUser = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return error(res, 'Access denied: users only', 403);
  }
  next();
};

module.exports = { authenticate, isMerchant, isUser };
