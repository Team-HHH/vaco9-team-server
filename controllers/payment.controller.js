const createError = require('http-errors');
const axios = require('axios');
const Campaign = require('../models/Advertiser');

exports.verifyPayment = async function (req, res, next) {
  try {
    const { imp_uid, merchant_uid } = req.body;
    const currentCampaign = Campaign.findById(merchant_uid);
    const amountToBePaid = currentCampaign.dailyBudget;

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMPORT_REST_API,
        imp_secret: process.env.IMPORT_REST_API_SECRET,
      }
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
      // expiresAt이 오늘보다 뒤인지 확인이 필요함
      await Campaign.findByIdAndUpdate(merchant_uid, { status: 'opened' });

      // 클라이언트에 리턴 줘야함.
      // status가 paid 말고 ready 같은것도 존재할 수 있는지 확인이 필요힘
      if (status === 'paid') {
        res.json({
          code: 200,
          message: '',
        });
      }
    } else {
      console.log('결제정보 다름. 위/변조된 결제임.');
    }

  } catch (err) {
    next(createError(500, err));
  }
};
