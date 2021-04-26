const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  advertiserRegisterValidation,
  advertiserLoginValidation,
} = require('../middlewares/validateInput');

const router = express.Router();

router.post('/login/advertiser', advertiserLoginValidation, authController.login);
router.post('/register/advertiser', advertiserRegisterValidation, authController.register);
router.post('/login/user', authController.loginUser);
router.post('/register/user', authController.registerUser);

module.exports = router;
