const express = require('express');
const { googleSignin, googleLogin } = require('../Controllers/googleAuthController.js');
const router = express.Router();

router.post('/google',googleSignin);
router.post('/google/login',googleLogin);

module.exports = router;