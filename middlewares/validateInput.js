const Joi = require('joi');
const {
  advertiserRegisterErrorMessage,
} = require('../constants/joiErrorMessage');
const { getErrorMessage } = require('../utils');

exports.advertiserRegisterValidation = function (req, res, next) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_EMAIL)),
    name: Joi.string()
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_NAME)),
    password: Joi.string()
      .min(8)
      .max(20)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_PASSWORD)),
    passwordConfirm: Joi.string()
      .min(8)
      .max(20)
      .valid(Joi.ref('password'))
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_PASSWORDCONFIRM)),
    companyName: Joi.string()
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_COMPANYNAME)),
    companyEmail: Joi.string()
      .email()
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_COMPANYEMAIL)),
    companyRegistrationNumber: Joi.string()
      .pattern(new RegExp('([0-9]{3})-([0-9]{2})-([0-9]{5})'))
      .required()
      .error(new Error(advertiserRegisterErrorMessage.INVALID_COMPANYREGISTRATIONNUMBER)),
  });

  validateRequest(req, res, next, schema);
};

exports.loginValidation = function (req, res, next) {
  const schema = Joi.object({
  });

  validateRequest(req, res, next, schema);
};

exports.createCampaignValidation = function (req, res, next) {
  const schema = Joi.object({
  });

  validateRequest(req, res, next, schema);
};

exports.paymentValidation = function (req, res, next) {
  const schema = Joi.object({
  });

  validateRequest(req, res, next, schema);
};

exports.campaignStatsValidation = function (req, res, next) {
  const schema = Joi.object({
  });

  validateRequest(req, res, next, schema);
};

async function validateRequest(req, res, next, schema) {
  const options = {
    abortEarly: true,
    allowUnknown: true,
  };

  try {
    await schema.validateAsync(req.body, options);

    next();
  } catch (err) {
    res.json({
      code: 400,
      message: getErrorMessage(err),
    });
  }
}
