const express = require('express');
const router = express.Router();
const carrelloController = require('../controllers/carrello.controller');

router.get('/:id_utente', carrelloController.getCarrello);
router.post('/', carrelloController.aggiungiArticolo);

module.exports = router;
