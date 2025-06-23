const pagamentiModel = require('../models/pagamenti.model');

// Crea un nuovo pagamento
exports.creaPagamento = async (req, res) => {
  try {
    const { id_ordine, importo, metodo_pagamento } = req.body;

    if (!id_ordine || !importo || !metodo_pagamento) {
      return res.status(400).json({ message: 'Dati mancanti' });
    }

    const esistente = await pagamentiModel.getByOrdine(id_ordine);
    if (esistente) {
      return res.status(400).json({ message: 'Pagamento già registrato per questo ordine' });
    }

    const pagamento = await pagamentiModel.create(
      id_ordine,
      Number(importo),
      metodo_pagamento,
      'completato' // Simuliamo il pagamento completato subito
    );

    res.status(201).json(pagamento);
  } catch (err) {
    console.error('Errore creazione pagamento:', err);
    res.status(500).json({ message: 'Errore server durante la creazione del pagamento' });
  }
};

// Recupera pagamento per ordine
exports.getByOrdine = async (req, res) => {
  try {
    const pagamento = await pagamentiModel.getByOrdine(req.params.id_ordine);
    if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });
    res.json(pagamento);
  } catch (err) {
    res.status(500).json({ message: 'Errore server durante il recupero' });
  }
};

// Aggiorna stato pagamento
exports.updateStato = async (req, res) => {
  try {
    const { stato_pagamento } = req.body;
    if (!stato_pagamento) return res.status(400).json({ message: 'Stato mancante' });

    const pagamento = await pagamentiModel.updateStato(req.params.id_ordine, stato_pagamento);
    if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });

    res.json(pagamento);
  } catch (err) {
    res.status(500).json({ message: 'Errore server durante aggiornamento stato' });
  }
};

// Elimina pagamento
exports.remove = async (req, res) => {
  try {
    const pagamento = await pagamentiModel.deleteByOrdine(req.params.id_ordine);
    if (!pagamento) return res.status(404).json({ message: 'Pagamento non trovato' });

    res.json({ message: 'Pagamento eliminato', pagamento });
  } catch (err) {
    res.status(500).json({ message: 'Errore server durante eliminazione' });
  }
};
