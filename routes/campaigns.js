const express = require('express');
const campaignsController = require('../controllers/campaigns.controller');

const router = express.Router();

router.get('/:advertiserId');
router.get('/popup');
router.post('/campaigns');

module.exports = router;
