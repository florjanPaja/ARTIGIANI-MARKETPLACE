const articoliModel = require('../models/articoli.model');

// Elenco completo
exports.list = async (_req, res) => {
  const articoli = await articoliModel.getAll();
  res.json(articoli);
};

// Articolo per ID
exports.getById = async (req, res) => {
  const articolo = await articoliModel.getById(req.params.id);
  if (!articolo) return res.status(404).json({ message: 'Articolo non trovato' });
  res.json(articolo);
};

// Articoli per artigiano
exports.getByArtigiano = async (req, res) => {
  const articoli = await articoliModel.getByArtigiano(req.params.id_artigiano);
  res.json(articoli);
};

// Creazione nuovo articolo
exports.create = async (req, res) => {
  const articolo = await articoliModel.create(req.body);
  res.status(201).json(articolo);
};

// Aggiornamento (campi parziali)
exports.update = async (req, res) => {
  const articolo = await articoliModel.updateArticolo(req.params.id, req.body);
  if (!articolo) return res.status(404).json({ message: 'Articolo non trovato o nessun campo modificato' });
  res.json(articolo);
};

// Eliminazione
exports.remove = async (req, res) => {
  const articolo = await articoliModel.deleteArticolo(req.params.id);
  if (!articolo) return res.status(404).json({ message: 'Articolo non trovato' });
  res.json({ message: 'Articolo eliminato', articolo });
};

// Ricerca (query param ?q=...)
exports.search = async (req, res) => {
  const risultati = await articoliModel.search(req.query.q || '');
  res.json(risultati);
};
