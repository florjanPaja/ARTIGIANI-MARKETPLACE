const pagamentiModel = require('../models/pagamenti.model');

// Crea un nuovo pagamento
exports.creaPagamento = async (req, res) => {
  const { id_ordine, importo, metodo_pagamento } = req.body;
  const pagamento = await pagamentiModel.create(id_ordine, importo, metodo_pagamento);
  res.status(201).json(pagamento);
};

// Recupera pagamento per ordine
exports.getByOrdine = async (req, res) => {
  const pagamento = await pagamentiModel.getByOrdine(req.params.id_ordine);
  if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });
  res.json(pagamento);
};

// Aggiorna stato pagamento
exports.updateStato = async (req, res) => {
  const { stato_pagamento } = req.body;
  const pagamento = await pagamentiModel.updateStato(req.params.id_ordine, stato_pagamento);
  if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });
  res.json(pagamento);
};

// Elimina pagamento
exports.remove = async (req, res) => {
  const pagamento = await pagamentiModel.deleteByOrdine(req.params.id_ordine);
  if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });
  res.json({ message: 'Pagamento eliminato', pagamento });
};
