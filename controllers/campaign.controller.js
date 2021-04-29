const createError = require('http-errors');

const Campaign = require('../models/Campaign');
const Advertiser = require('../models/Advertiser');
const User = require('../models/User');
const UserStats = require('../models/UserStats');
const UserByAge = require('../models/UserByAge');
const { getRandomIntInclusive, range } = require('../utils');
const { campaignErrorMessage } = require('../constants/controllerErrorMessage');
const { campaignResponseMessage } = require('../constants/responseMessage');

exports.createCampaign = async function (req, res, next) {
  try {
    const newCampaign = await Campaign.create({
      ...req.body,
      remainingBudget: req.body.dailyBudget,
    });

    await Advertiser.findByIdAndUpdate(
      req.id,
      { $addToSet: { campaigns: newCampaign._id } }
    );

    await UserStats.findOneAndUpdate({
      country: req.body.country,
    }, {
      $inc: { countryTargetedCount: 1 }
    });

    const promises = range(req.body.minAge, req.body.maxAge).map(age => {
      return UserByAge.findOneAndUpdate({
        country: req.body.country,
        age: age,
        gender: req.body.gender,
      }, {
        $inc: { targetedCount: 1 },
      });
    });

    await Promise.all(promises);

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
      .findById(req.id)
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
    const currentUser = await User.findById(req.id);
    const openedCampaigns = await Campaign.find({
      status: 'opened',
      country: { $elemMatch: { $eq: currentUser.country } },
      gender: { $in: [currentUser.gender, 'both'] },
      minAge: { $lte: currentUser.age },
      maxAge: { $gte: currentUser.age },
      remainingBudget: { $gte: randomCost },
    }).lean();

    if (!openedCampaigns.length) {
      return res.json({
        code: 200,
        message: campaignResponseMessage.NO_CAMPAIGN_WITH_REMAININGBUDGET_LEFT_RESPONSE,
      });
    }

    const {
      _id,
      content,
      campaignUrl
    } = getRandomCampaign(openedCampaigns);

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
    const currentUser = await User.findById(req.id);


    const randomCost = getRandomIntInclusive(100, 1000);

    await Campaign.findByIdAndUpdate(
      pickedCampaign._id,
      { 
        $inc: { remainingBudget: -randomCost }
      }
    );



    if (type === 'reach') {
      const targetAge = await UserByAge.findOneAndUpdate({
        country: currentUser.country,
        age: currentUser.age,
        gender: currentUser.gender,
      }, {
        $inc: { reach: 1 },
      });

      const reachCost = targetAge.basicReachPrice * random(0.8, 1.2);

      await Campaign.addReachCount(campaignId, currentUser);
    } else if (type === 'click') {
      await UserByAge.findOneAndUpdate({
        country: currentUser.country,
        age: currentUser.age,
        gender: currentUser.gender,
      }, {
        $inc: { click: 1 },
      });
      await Campaign.addClickCount(campaignId, currentUser);
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

    const targets = await UserByAge.find({
      country: { $in: [...country] },
      'age': {
        $lte: Number(maxAge),
        $gte: Number(minAge),
      },
      'gender': gender === 'both' ? { $or: ['male', 'female'] } : gender,
    });

    const { cpm, cpc, userCount, ctr } = targets.reduce((acc, cur) => {
      acc.cpm += (cur.usedBudget / cur.reach * 1000);
      acc.cpc += (cur.usedBudget / cur.click);
      acc.userCount += cur.userCount;
      acc.ctr += (cur.click / cur.reach);
      return acc;
    }, {'cpm': 0, 'cpc': 0, 'userCount': 0, 'ctr': 0});

    res.json({
      cpm: cpm / targets.length,
      cpc: cpc / targets.length,
      userCount,
      ctr: ctr / targets.length,
    });
  } catch (error) {
    next(createError(500, error));
  }
};

function getRandomCampaign(campaigns) {
  const randomCampaignIndex = Math.floor(Math.random() * campaigns.length);

  return campaigns[randomCampaignIndex];
}
