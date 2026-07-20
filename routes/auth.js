const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/register
router.get('/register', authController.showRegisterForm);

// POST /auth/register
router.post('/register', authController.handleRegister);

// GET /auth/login
router.get('/login', authController.showLogin);

// POST /auth/login
router.post('/login', authController.handleLogin);

// GET /auth/logout
router.get('/logout', authController.logout);

module.exports = router;