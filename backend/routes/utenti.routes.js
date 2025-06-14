const express = require('express');
const router = express.Router();
const utentiController = require('../controllers/utenti.controller');
const { verifyToken, onlyAdmin, isSelfOrAdmin } = require('../middlewares/auth.middleware');

// Rotta pubblica
router.post('/register', utentiController.register);

// Rotte protette
router.get('/', verifyToken, onlyAdmin, utentiController.list);
router.get('/:id', verifyToken, isSelfOrAdmin, utentiController.getById);
router.put('/:id', verifyToken, isSelfOrAdmin, utentiController.update);
router.delete('/:id', verifyToken, isSelfOrAdmin, utentiController.remove);

module.exports = router;
