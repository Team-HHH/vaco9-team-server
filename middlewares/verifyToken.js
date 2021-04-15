const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

exports.verifyUser = async function (req, res, next) {
  try {
    await jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(createError(401, err));
      }

      if (!req.user) {
        const currentUser = await User.findById(decoded.id);
        req.user = currentUser._id;
      }

      next();
    });
  } catch (err) {
    next(createError(500, err));
  }
};
