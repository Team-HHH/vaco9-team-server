const express = require('express');
const campaignController = require('../controllers/campaign.controller');

const router = express.Router();

router.post('/', campaignController.createCampaign);
router.get('/popup', campaignController.getCampaignPopUp);
router.patch('/stats', campaignController.updateCampaignStats);
router.get('/:advertiserId', campaignController.getAdvertiserCampaigns);

module.exports = router;
