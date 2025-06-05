const express = require('express');
const router = express.Router();
const ordiniController = require('../controllers/ordini.controller');

router.post('/', ordiniController.createOrdine);
router.get('/utente/:id_utente', ordiniController.getOrdiniUtente);

module.exports = router;
