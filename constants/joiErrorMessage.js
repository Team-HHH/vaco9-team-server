exports.commonErrorMessage = Object.freeze({
  INVALID_EMAIL: 'E-mail is invalid',
  INVALID_PASSWORD: 'Password is invalid',
});

exports.advertiserRegisterErrorMessage = Object.freeze({
  INVALID_NAME: 'Name is invalid',
  INVALID_PASSWORDCONFIRM: 'Password confirm is not same as password',
  INVALID_COMPANYNAME: 'Company name is invalid',
  INVALID_COMPANYEMAIL: 'Company email is invalid',
  INVALID_COMPANYREGISTRATIONNUMBER: 'Company registration number is invalid',
});

exports.createCampaignErrorMessage = Object.freeze({
  INVALID_TITLE: 'Title is invalid',
  INVALID_CAMPAIGNTYPE: 'Campaign type is invalid',
  INVALID_EXPIRESTYPE: 'Expires type is invalid',
  INVALID_CONTENT: 'Content is invalid',
  INVALID_EXPIRESAT: 'ExpiresAt is invalid',
  INVALID_DAILYBUDGET: 'Daily budget is invalid',
});

exports.paymentErrorMessage = Object.freeze({
  INVALID_IMP_UID: 'Imp_uid is necessary value',
  INVALID_MERCHANT_UID: 'Merchant_uid is necessary value',
});
