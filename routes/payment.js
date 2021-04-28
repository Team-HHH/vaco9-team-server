const express = require('express');
const { verifyAdvertiser } = require('../middlewares/verifyAdvertiser');
const { paymentValidation } = require('../middlewares/validateInput');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

router.post('/verify', verifyAdvertiser, paymentValidation, paymentController.verifyPayment);

module.exports = router;
