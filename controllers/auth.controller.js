const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Advertiser = require('../models/Advertiser');

exports.register = async function (req, res, next) {
  try {
    const isExistAdvertiser = await Advertiser.checkIsAdvertiserExist(req.body);

    if (isExistAdvertiser) {
      return next(createError(400));
    }

    const {
      email,
      name,
      password,
      companyName,
      companyEmail,
      companyRegistrationNumber,
    } = req.body;
    const hashedPassword = await argon2.hash(password);

    await Advertiser.create({
      email,
      name,
      password: hashedPassword,
      companyName,
      companyEmail,
      companyRegistrationNumber,
    });

    res.json({
      code: 200,
      message: 'register success',
    });
  } catch (err) {
    next(createError(500, err));
  }
};

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
        user: {
          email: "ykh@naver.com",
          name: "유경호",
          companyName: "바닐라코딩",
          companyEmail: "https://www.vanillacoding.co/",
        },
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
