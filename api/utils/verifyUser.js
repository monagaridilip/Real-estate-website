import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies && req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      // If there's an error during token verification, handle it appropriately
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Token expired'));
      } else {
        return next(errorHandler(403, 'Forbidden'));
      }
    }

    req.user = user;
    next();
  });
};
