const { sendError } = require('../utils/response');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Access denied. This route is restricted to: ${roles.join(', ')}.`);
    }
    next();
  };
};

module.exports = { authorize };
