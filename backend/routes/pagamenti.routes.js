const express = require('express');
const router = express.Router();
const pagamentiController = require('../controllers/pagamenti.controller');
const { verifyToken, onlyAdmin } = require('../middlewares/auth.middleware');

// Crea nuovo pagamento
router.post('/', verifyToken, pagamentiController.creaPagamento);

// Recupera pagamento per ordine
router.get('/:id_ordine', verifyToken, pagamentiController.getByOrdine);

// Aggiorna stato (solo admin)
router.put('/:id_ordine', verifyToken, onlyAdmin, pagamentiController.updateStato);

// Elimina pagamento (solo admin)
router.delete('/:id_ordine', verifyToken, onlyAdmin, pagamentiController.remove);

module.exports = router;
