const express = require('express');
const auth = require('./auth');
const campaigns = require('./campaigns');
const videos = require('./videos');

const router = express.Router();

router.use('/auth', auth);
router.use('/campaigns', campaigns);
router.use('/videos', videos);

module.exports = router;
