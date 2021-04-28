const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const {
  createCampaignValidation,
  campaignStatsValidation,
} = require('../middlewares/validateInput');
const { verifyAdvertiser } = require('../middlewares/verifyAdvertiser');

const router = express.Router();

router.post('/', verifyAdvertiser, createCampaignValidation, campaignController.createCampaign);
router.get('/', verifyAdvertiser, campaignController.getAdvertiserCampaigns);
router.get('/popup', campaignController.getCampaignPopUp);
router.patch('/stats', campaignStatsValidation, campaignController.updateCampaignStats);

module.exports = router;
