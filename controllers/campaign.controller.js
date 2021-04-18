const createError = require('http-errors');
const Campaign = require('../models/Campaign');

exports.createCampaign = async function (req, res, next) {
  try {
    const { title, campaignType, expiresType, content, expiresAt, dailyBudget } = req.body;
    const remainingBudget = dailyBudget;

    const newCampaign = await Campaign.create({
      title,
      campaignType,
      expiresType,
      content,
      expiresAt,
      dailyBudget,
      remainingBudget,
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
