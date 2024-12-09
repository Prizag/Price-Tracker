const express = require('express');
const { signInUser, LogInUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signInUser);
router.post('/login', LogInUser);



module.exports = router;