const express = require('express');
const campaignController = require('../controllers/campaign.controller');

const router = express.Router();

router.get('/:advertiserId', campaignController.getAdvertiserCampaigns);
router.get('/popup');
router.post('/', campaignController.createCampaign);

module.exports = router;