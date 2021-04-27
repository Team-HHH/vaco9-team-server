const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  advertiserRegisterValidation,
  advertiserLoginValidation,
  userRegisterValidation,
  userLoginValidation,
} = require('../middlewares/validateInput');

const router = express.Router();

router.post('/register/advertiser', advertiserRegisterValidation, authController.register);
router.post('/login/advertiser', advertiserLoginValidation, authController.login);
router.post('/register/user', userRegisterValidation, authController.registerUser);
router.post('/login/user', userLoginValidation, authController.loginUser);

module.exports = router;
