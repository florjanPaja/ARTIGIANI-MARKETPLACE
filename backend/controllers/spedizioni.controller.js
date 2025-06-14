const spedizioniModel = require('../models/spedizioni.model');

// Crea una nuova spedizione
exports.creaSpedizione = async (req, res) => {
  const spedizione = await spedizioniModel.create(req.body);
  res.status(201).json(spedizione);
};

// Recupera spedizione per ordine
exports.getByOrdine = async (req, res) => {
  const spedizione = await spedizioniModel.getByOrdine(req.params.id_ordine);
  if (!spedizione) return res.status(404).json({ message: 'Spedizione non trovata' });
  res.json(spedizione);
};

// Aggiorna stato spedizione
exports.updateStato = async (req, res) => {
  const { stato_spedizione } = req.body;
  const spedizione = await spedizioniModel.updateStato(req.params.id_ordine, stato_spedizione);
  if (!spedizione) return res.status(404).json({ message: 'Spedizione non trovata' });
  res.json(spedizione);
};

// Elimina spedizione
exports.remove = async (req, res) => {
  const spedizione = await spedizioniModel.deleteByOrdine(req.params.id_ordine);
  if (!spedizione) return res.status(404).json({ message: 'Spedizione non trovata' });
  res.json({ message: 'Spedizione eliminata', spedizione });
};
