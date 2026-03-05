const express = require('express');
const {registerUser , verification , loginUser,  logoutUser, forgotPassword, verifyOTP, changePassword} = require('../controllers/usercontroller.js');
const isAuthenticated = require('../middleware/isAuthenticated.js');
const router = express.Router();

router.post('/register', registerUser );
router.post('/verify', verification);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.post('/forgot-password',forgotPassword );
router.post('/verify-otp/:email', verifyOTP);
router.post('/change-password/:email', changePassword);
module.exports = router;