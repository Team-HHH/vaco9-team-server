const express = require('express');
const uploadsController = require('../controllers/uploads.controller');
const { verifyAdvertiser } = require('../middlewares/verifyAdvertiser');

const upload = require('../modules/multer');

const router = express.Router();

router.post('/uploads', verifyAdvertiser, upload.single('image'), uploadsController.uploadImage);

module.exports = router;
