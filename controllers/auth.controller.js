const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Advertiser = require('../models/Advertiser');

exports.register = async function (req, res, next) {
  const {
    email,
    name,
    password,
    companyName,
    companyEmail,
    companyRegistrationNumber,
  } = req.bidy;

  try {
    const isVaildEmail = await Advertiser.exists({ email });
    const isValidCompanyName = await Advertiser.exists({ companyName });
    const isValidCompanyEmail = await Advertiser.exists({ companyEmail });
    const isValidCompanyRegistrationNumber = await Advertiser.exists({ companyRegistrationNumber });

    if (!(isVaildEmail && isValidCompanyName && isValidCompanyEmail && isValidCompanyRegistrationNumber)) {
      return next(createError(400));
    }

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
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
