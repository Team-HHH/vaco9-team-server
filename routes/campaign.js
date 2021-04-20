const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const {
  createCampaignValidation,
  campaignStatsValidation,
} = require('../middlewares/validateInput');

const router = express.Router();

router.post('/', createCampaignValidation, campaignController.createCampaign);
router.get('/popup', campaignController.getCampaignPopUp);
router.patch('/stats', campaignStatsValidation, campaignController.updateCampaignStats);
router.get('/:advertiserId', campaignController.getAdvertiserCampaigns);

module.exports = router;
