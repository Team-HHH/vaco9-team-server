const createError = require('http-errors');
const Campaign = require('../models/Campaign');
const Advertiser = require('../models/Advertiser');

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

exports.getAdvertiserCampaigns = async function (req, res, next) {
  try {
    const advertiserId = req.params.advertiserId;
    const advertiser = await Advertiser.findById(advertiserId);

    if (!advertiser) {
      return next(createError(401));
    }

    const advertiserCampaigns = await Advertiser
      .findOne({ _id: advertiserId })
      .populate('campaigns');

    res.json({
      code: 200,
      message: 'success',
      data: {
        campaigns: advertiserCampaigns,
      },
    });
  } catch (error) {
    next(createError(500, error));
  }
};
