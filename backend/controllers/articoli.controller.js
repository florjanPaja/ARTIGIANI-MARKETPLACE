const articoliModel = require('../models/articoli.model');

exports.list = async (_req, res) => {
  const articoli = await articoliModel.getAll();
  res.json(articoli);
};

exports.getById = async (req, res) => {
  const articolo = await articoliModel.getById(req.params.id);
  if (!articolo) return res.status(404).json({ message: 'Articolo non trovato' });
  res.json(articolo);
};

exports.create = async (req, res) => {
  const articolo = await articoliModel.create(req.body);
  res.status(201).json(articolo);
};
