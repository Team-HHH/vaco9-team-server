const createError = require('http-errors');
const { formatISO, parseISO, addHours } = require('date-fns');
const Campaign = require('../models/Campaign');
const Advertiser = require('../models/Advertiser');
const getRandomIntInclusive = require('../utils');

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
    const advertiser = await Advertiser
      .findOne({ _id: advertiserId })
      .populate('campaigns');

    if (!advertiser) {
      return next(createError(400));
    }

    res.json({
      code: 200,
      message: 'success campaign',
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
        message: 'There are no campaign with remainingBudget left',
      });
    }

    const pickedCampaign = getRandomCampaign(openedCampaigns);

    await Campaign.findByIdAndUpdate(
      pickedCampaign._id,
      { $inc: { remainingBudget: -randomCost, }, }
    );

    const { _id, content, } = pickedCampaign;

    res.json({
      code: 200,
      message: 'success to get campaign pop-up',
      data: {
        campaignId: _id,
        content,
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
    } else {
      return next(createError(400));
    }

    res.json({
      code: 200,
      message: 'update campaign stats success',
    });
  } catch (error) {
    next(createError(500, error));
  }
};

function getRandomCampaign(campaigns) {
  const randomCampaignIndex = Math.floor(Math.random() * campaigns.length);

  return campaigns[randomCampaignIndex];
}
