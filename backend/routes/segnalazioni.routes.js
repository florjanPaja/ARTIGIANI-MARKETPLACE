const express = require('express');
const router = express.Router();
const controller = require('../controllers/segnalazioni.controller');
const { verifyToken, onlyAdmin, isSelfOrAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, controller.creaSegnalazione);
router.post('/:id/messaggi', verifyToken, controller.aggiungiMessaggio);
router.get('/:id/messaggi', verifyToken, controller.getMessaggi);
router.put('/:id/stato', verifyToken, onlyAdmin, controller.aggiornaStato);
router.get('/utente/:id', verifyToken, isSelfOrAdmin, controller.getSegnalazioniUtente);
router.get('/', verifyToken, onlyAdmin, controller.getAll); // per admin dashboard

module.exports = router;
