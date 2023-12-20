const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// Rota de autenticação
router.post('/login', login);

module.exports = router;
