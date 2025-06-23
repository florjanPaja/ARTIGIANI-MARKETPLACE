const express = require('express');
const router = express.Router();
const controller = require('../controllers/utenti.controller');
const auth = require('../middlewares/auth.middleware');

// 🔓 Pubblico: registrazione + profilo artigiano
router.post('/register', controller.register);
router.get('/artigiani/:id/pubblico', controller.getProfiloPubblico);

// 🔐 Protette: autenticazione obbligatoria
router.use(auth.verifyToken);

// 🔐 Solo admin: lista completa e statistiche
router.get('/', auth.onlyAdmin, controller.list);
router.get('/stats', auth.onlyAdmin, controller.stats);

// 🔐 Visualizza/modifica/cancella un profilo (sé stesso o admin)
router.get('/:id', auth.isSelfOrAdmin, controller.getById);
router.put('/:id', auth.isSelfOrAdmin, controller.update);
router.delete('/:id', auth.isSelfOrAdmin, controller.remove);

module.exports = router;
