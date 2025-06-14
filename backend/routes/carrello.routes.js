const express = require('express');
const router = express.Router();
const carrelloController = require('../controllers/carrello.controller');
const { verifyToken, isSelfOrAdmin } = require('../middlewares/auth.middleware');

// Recupera il carrello (protetto)
router.get('/:id_utente', verifyToken, isSelfOrAdmin, carrelloController.getCarrello);

// Aggiunge o aggiorna un articolo (protetto)
router.post('/', verifyToken, carrelloController.aggiungiArticolo);

// Rimuove un articolo (protetto)
router.post('/rimuovi', verifyToken, carrelloController.rimuoviArticolo);

module.exports = router;
