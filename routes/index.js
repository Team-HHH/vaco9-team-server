const express = require('express');
const auth = require('./auth');
const campaign = require('./campaign');
const videos = require('./videos');
const payment = require('./payment');

const router = express.Router();

router.use('/auth', auth);
router.use('/campaign', campaign);
router.use('/videos', videos);
router.use('/payment', payment);

module.exports = router;
