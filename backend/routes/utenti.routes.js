const express = require('express');
const router = express.Router();
const utentiController = require('../controllers/utenti.controller');

router.post('/register', utentiController.register);

module.exports = router;
