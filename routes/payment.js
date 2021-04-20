const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { paymentValidation } = require('../middlewares/validateInput');

const router = express.Router();

router.post('/verify', paymentValidation, paymentController.verifyPayment);

module.exports = router;
