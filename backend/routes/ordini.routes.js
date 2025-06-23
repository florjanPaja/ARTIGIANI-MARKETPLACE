const express = require('express');
const router = express.Router();
const ordiniController = require('../controllers/ordini.controller');

const {
  verifyToken,
  onlyAdmin,
  isSelfOrAdmin,
  isArtigiano
} = require('../middlewares/auth.middleware');

// ✅ Crea nuovo ordine
router.post('/', verifyToken, ordiniController.createOrdine);

// ✅ Ottieni ordini del cliente (self o admin)
router.get('/utente/:id_utente', verifyToken, isSelfOrAdmin, ordiniController.getOrdiniUtente);

// ✅ Ordini per articoli di un artigiano
router.get('/artigiano/:id_artigiano', verifyToken, isArtigiano, ordiniController.getOrdiniArtigiano);

// ✅ Dettaglio ordine completo (testata + righe)
router.get('/:id', verifyToken, ordiniController.getOrdineCompleto);

// ✅ Lista completa (solo admin)
router.get('/admin/all', verifyToken, onlyAdmin, ordiniController.listAll);

// ✅ Modifica stato ordine
router.put('/:id', verifyToken, ordiniController.updateStato);

// ✅ Elimina ordine (admin)
router.delete('/:id', verifyToken, onlyAdmin, ordiniController.remove);

// ✅ Statistiche per stato (admin)
router.get('/admin/stats/count-by-stato', verifyToken, onlyAdmin, ordiniController.countByStato);

// ✅ Vendite totali artigiano
router.get('/artigiano/:id_artigiano/stats/totale', verifyToken, isArtigiano, ordiniController.venditeTotaliArtigiano);

// ✅ Vendite per articolo artigiano
router.get('/artigiano/:id_artigiano/stats/articoli', verifyToken, isArtigiano, ordiniController.venditePerArticolo);

module.exports = router;
