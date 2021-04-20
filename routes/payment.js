const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { paymentValidation } = require('../middlewares/validateInput');
const { verifyAdvertiser } = require('../middlewares/verifyAdvertiser');

const router = express.Router();

router.post('/verify', verifyAdvertiser, paymentValidation, paymentController.verifyPayment);

module.exports = router;
