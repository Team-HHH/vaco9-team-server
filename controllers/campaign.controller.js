const createError = require('http-errors');
const Campaign = require('../models/Advertiser');

exports.createCampaign = async function (req, res, next) {
  try {
    const { title, type, content, expiresAt, dailyBudget } = req.body;
    const newCampaign = await Campaign.create({
      title,
      type,
      content,
      expiresAt,
      dailyBudget,
    });

    res.json({
      code: 200,
      message: 'create campaign success',
      data: {
        merchantId: newCampaign._id,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
