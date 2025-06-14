const express = require('express');
const router = express.Router();
const pagamentiController = require('../controllers/pagamenti.controller');
const { verifyToken, onlyAdmin } = require('../middlewares/auth.middleware');

// Crea un nuovo pagamento
router.post('/', verifyToken, pagamentiController.creaPagamento);

// Recupera pagamento per ordine
router.get('/:id_ordine', verifyToken, pagamentiController.getByOrdine);

// Aggiorna stato pagamento
router.put('/:id_ordine', verifyToken, onlyAdmin, pagamentiController.updateStato);

// Elimina pagamento
router.delete('/:id_ordine', verifyToken, onlyAdmin, pagamentiController.remove);

module.exports = router;
