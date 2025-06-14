const express = require('express');
const router = express.Router();
const ordiniController = require('../controllers/ordini.controller');
const { verifyToken, onlyAdmin, isSelfOrAdmin } = require('../middlewares/auth.middleware');

// Crea nuovo ordine
router.post('/', verifyToken, ordiniController.createOrdine);

// Ordini per utente
router.get('/utente/:id_utente', verifyToken, isSelfOrAdmin, ordiniController.getOrdiniUtente);

// Dettaglio ordine completo
router.get('/:id', verifyToken, ordiniController.getOrdineCompleto);

// Lista completa (solo admin)
router.get('/all', verifyToken, onlyAdmin, ordiniController.listAll);

// Aggiorna stato ordine
router.put('/:id', verifyToken, ordiniController.updateStato);

// Elimina ordine
router.delete('/:id', verifyToken, ordiniController.remove);

module.exports = router;
