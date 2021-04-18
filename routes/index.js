const express = require('express');
const auth = require('./auth');
const campaigns = require('./campaigns');
const videos = require('./videos');
const payment = require('./payment');

const router = express.Router();

router.use('/auth', auth);
router.use('/campaigns', campaigns);
router.use('/videos', videos);
router.use('/payment', payment);

module.exports = router;
