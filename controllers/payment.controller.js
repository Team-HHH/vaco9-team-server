const createError = require('http-errors');
const axios = require('axios');
const { differenceInCalendarDays } = require('date-fns');
const Campaign = require('../models/Campaign');

exports.verifyPayment = async function (req, res, next) {
  try {
    const { imp_uid, merchant_uid } = req.body;
    const currentCampaign = await Campaign.findById(merchant_uid);
    const campaignDuration = differenceInCalendarDays(currentCampaign.expiresAt, new Date());
    const amountToBePaid = currentCampaign.dailyBudget * campaignDuration;

    console.log(amountToBePaid);

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMPORT_REST_API,
        imp_secret: process.env.IMPORT_REST_API_SECRET,
      },
    });

    const { access_token } = getToken.data.response;

    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: 'GET',
      headers: { 'Authorization': access_token },
    });

    const paymentData = getPaymentData.data.response;
    const { amount, status } = paymentData;

    if (amount === amountToBePaid) {
      await Campaign.findByIdAndUpdate(merchant_uid, { status: 'opened' });

      if (status === 'paid') {
        res.json({
          code: 200,
          message: '',
        });
      }
    } else {
      next(createError(400));
    }
  } catch (err) {
    next(createError(500, err));
  }
};
