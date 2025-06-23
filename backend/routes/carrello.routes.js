const express = require('express');
const router = express.Router();
const carrelloController = require('../controllers/carrello.controller');
const { verifyToken, isSelfOrAdmin } = require('../middlewares/auth.middleware');

// 🔒 Recupera il carrello dell'utente autenticato
router.get('/:id_utente', verifyToken, isSelfOrAdmin, carrelloController.getCarrello);

// 🔒 Aggiunge o aggiorna un articolo nel carrello
router.post('/', verifyToken, carrelloController.aggiungiArticolo);

// 🔒 Rimuove un articolo specifico dal carrello
router.post('/rimuovi', verifyToken, carrelloController.rimuoviArticolo);

// ✅ 🔒 Svuota completamente il carrello
router.post('/svuota', verifyToken, carrelloController.svuotaCarrello);

module.exports = router;
