const express = require('express');
const router = express.Router();
const controller = require('../controllers/articoli.controller');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth.middleware');

// 🔓 Public: lista e dettaglio
router.get('/', controller.list); // tutti
router.get('/:id', controller.getById); // tutti
router.get('/search', controller.search); // tutti

// 🔐 Solo autenticati
router.use(auth.verifyToken);

// 🔐 Articoli di un artigiano (admin o artigiano stesso)
router.get('/artigiano/:id_artigiano', auth.isArtigiano, controller.getByArtigiano);

// 🔐 Crea articolo (artigiano o admin)
router.post(
  '/',
  upload.array('immagini', 5),
  controller.create
);

// 🔐 Aggiorna (artigiano proprietario o admin)
router.put(
  '/:id',
  upload.array('immagini', 5),
  controller.update
);

// 🔐 Elimina (artigiano proprietario o admin)
router.delete('/:id', controller.remove);

// 🔐 Statistiche – solo admin
router.get('/admin/stats', auth.onlyAdmin, controller.stats);

// 🔐 Statistiche per artigiano
router.get('/artigiano/:id_artigiano/stats', auth.isArtigiano, controller.statsByArtigiano);

module.exports = router;
