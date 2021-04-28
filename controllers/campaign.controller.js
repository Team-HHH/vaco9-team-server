const createError = require('http-errors');

const Campaign = require('../models/Campaign');
const Advertiser = require('../models/Advertiser');
const UserStats = require('../models/UserStats');
const getRandomIntInclusive = require('../utils');
const { campaignErrorMessage } = require('../constants/controllerErrorMessage');
const { campaignResponseMessage } = require('../constants/responseMessage');

exports.createCampaign = async function (req, res, next) {
  try {
    const {
      title,
      campaignType,
      expiresType,
      content,
      expiresAt,
      dailyBudget,
      campaignUrl
    } = req.body;
    const remainingBudget = dailyBudget;

    const newCampaign = await Campaign.create({
      title,
      campaignType,
      expiresType,
      content,
      expiresAt,
      dailyBudget,
      remainingBudget,
      campaignUrl,
    });

    await Advertiser.findByIdAndUpdate(
      req.advertiserId,
      { $addToSet: { campaigns: newCampaign._id } }
    );

    res.json({
      code: 200,
      message: campaignResponseMessage.CREATE_CAMPAIGN_SUCCESS_RESPONSE,
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
    const advertiser = await Advertiser
      .findById(req.advertiserId)
      .populate('campaigns')
      .lean();

    if (!advertiser) {
      return next(createError(400), campaignErrorMessage.NONEXISTENT_ADVERTISER_ERROR);
    }

    res.json({
      code: 200,
      message: campaignResponseMessage.GET_CAMPAIGN_SUCCESS_RESPONSE,
      data: {
        campaigns: advertiser.campaigns,
      },
    });
  } catch (error) {
    next(createError(500, error));
  }
};

exports.getCampaignPopUp = async function (req, res, next) {
  try {
    const randomCost = getRandomIntInclusive(100, 1000);
    const openedCampaigns = await Campaign.find({
      status: 'opened',
      remainingBudget: { $gte: randomCost, },
    }).lean();

    if (!openedCampaigns.length) {
      return res.json({
        code: 200,
        message: campaignResponseMessage.NO_CAMPAIGN_WITH_REMAININGBUDGET_LEFT_RESPONSE,
      });
    }

    const pickedCampaign = getRandomCampaign(openedCampaigns);

    await Campaign.findByIdAndUpdate(
      pickedCampaign._id,
      { $inc: { remainingBudget: -randomCost, }, }
    );

    const {
      _id,
      content,
      campaignUrl
    } = pickedCampaign;

    res.json({
      code: 200,
      message: campaignResponseMessage.GET_CAMPAIGN_POPUP_SUCCESS_RESPONSE,
      data: {
        campaignId: _id,
        content,
        campaignUrl,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.updateCampaignStats = async function (req, res, next) {
  try {
    const { campaignId, type } = req.body;

    if (type === 'reach') {
      await Campaign.addReachCount(campaignId);
    } else if (type === 'click') {
      await Campaign.addClickCount(campaignId);
    }

    res.json({
      code: 200,
      message: campaignResponseMessage.UPDATE_CAMPAIGN_STATS_SUCCESS,
    });
  } catch (error) {
    next(createError(500, error));
  }
};

exports.getEstimateStats = async function (req, res, next) {
  try {
    const { minAge, maxAge, gender, country } = req.body;

    const targets = UserStats.find({
      country,
      'stats.age': {
        $lte: minAge,
        $gte: maxAge,
      },
      'stats.gender': gender === 'both' ? { $or: ['male', 'female'] } : gender,
    }).lean();


  } catch (error) {
    next(createError(500, error));
  }
};

function getRandomCampaign(campaigns) {
  const randomCampaignIndex = Math.floor(Math.random() * campaigns.length);

  return campaigns[randomCampaignIndex];
}
