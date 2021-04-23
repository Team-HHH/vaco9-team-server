const express = require('express');
const uploadsController = require('../controllers/uploads.controller');
const { verifyAdvertiser } = require('../middlewares/verifyAdvertiser');

const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/', verifyAdvertiser, upload.single('image'), uploadsController.uploadImage);

module.exports = router;
