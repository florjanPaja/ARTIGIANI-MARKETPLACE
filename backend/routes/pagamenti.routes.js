const express = require('express');
const router = express.Router();
const pagamentiController = require('../controllers/pagamenti.controller');

router.post('/', pagamentiController.creaPagamento);

module.exports = router;
