const express = require('express');
const router = express.Router();
const articoliController = require('../controllers/articoli.controller');

router.get('/', articoliController.list);
router.get('/:id', articoliController.getById);
router.post('/', articoliController.create);

module.exports = router;
