const express = require('express');
const { signInUser, LogInUser } = require('../Controllers/authController.js');
const router = express.Router();

router.post('/signup', signInUser);
router.post('/login', LogInUser);



module.exports = router;