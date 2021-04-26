const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Advertiser = require('../models/Advertiser');
const User = require('../models/User');

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
          { expiresIn: '5H' }
        ),
        user: {
          email: currentAdvertiser.email,
          name: currentAdvertiser.name,
          companyName: currentAdvertiser.companyName,
          companyEmail: currentAdvertiser.companyEmail,
        },
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.loginUser = async function (req, res, next) {
  console.log(req.body)
  const { email, password } = req.body;

  try {
    const currentUser = await User.findOne({ email }).lean();

    if (!currentUser) {
      return next(createError(400));
    }

    const isCorrectPassword = await argon2.verify(currentUser.password, password);

    if (!isCorrectPassword) {
      return next(createError(401));
    }

    res.json({
      code: 200,
      message: 'login success',
      data: {
        accessToken: jwt.sign(
          { id: currentUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '5H' }
        ),
        name: currentUser.name,
        paymentState: currentUser.paymentState,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.registerUser = async function (req, res, next) {
  try {
    const isExistUser = await User.checkIsUserExist(req.body);

    if (isExistUser) {
      return next(createError(400));
    }

    const { email, password, name, } = req.body;
    const hashedPassword = await argon2.hash(password);

    await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.json({
      code: 200,
      message: 'register success',
    });
  } catch (err) {
    console.log(err.message)
    next(createError(500, err));
  }
};
