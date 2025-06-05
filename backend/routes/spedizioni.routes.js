const express = require('express');
const router = express.Router();
const spedizioniController = require('../controllers/spedizioni.controller');

router.post('/', spedizioniController.creaSpedizione);

module.exports = router;
