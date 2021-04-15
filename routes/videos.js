const express = require('express');
const videosController = require('../controllers/videos.controller');

const router = express.Router();

router.get('/');

module.exports = router;
