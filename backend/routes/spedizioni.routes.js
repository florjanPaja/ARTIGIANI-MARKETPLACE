const express = require('express');
const router = express.Router();
const spedizioniController = require('../controllers/spedizioni.controller');
const { verifyToken, onlyAdmin } = require('../middlewares/auth.middleware');

// Crea una nuova spedizione
router.post('/', verifyToken, spedizioniController.creaSpedizione);

// Recupera spedizione per ordine
router.get('/:id_ordine', verifyToken, spedizioniController.getByOrdine);

// Aggiorna stato spedizione (es. in_preparazione → spedito → consegnato)
router.put('/:id_ordine', verifyToken, onlyAdmin, spedizioniController.updateStato);

// Elimina spedizione
router.delete('/:id_ordine', verifyToken, onlyAdmin, spedizioniController.remove);

module.exports = router;
