const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Advertiser = require('../models/Advertiser');

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const currentAdvertiser = await Advertiser.findOne({ email }).lean();

    if (!currentAdvertiser) {
      return next(createError(400));
    }

    const isCorrectPassword = await argon2.verify(currentAdvertiser.password, password);

    if (!isCorrectPassword) {
      return next(createError(401));
    }

    res.json({
      code: 200,
      message: 'login success',
      data: {
        accessToken: jwt.sign(
          { id: currentAdvertiser._id },
          process.env.JWT_SECRET,
          { expiresIn: '5H' },
        ),
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
