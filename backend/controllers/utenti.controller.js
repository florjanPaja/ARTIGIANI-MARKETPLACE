const bcrypt = require('bcrypt');
const utentiModel = require('../models/utenti.model');

// Registrazione nuovo utente
exports.register = async (req, res) => {
  const data = req.body;

  if (!data.password) {
    return res.status(400).json({ message: 'Password obbligatoria' });
  }

  data.password_hash = await bcrypt.hash(data.password, 10);
  delete data.password; // rimuovi campo plain-text

  const utente = await utentiModel.createUtente(data);
  res.status(201).json(utente);
};

// Recupera tutti gli utenti
exports.list = async (_req, res) => {
  const utenti = await utentiModel.getAll();
  res.json(utenti);
};

// Recupera utente per ID
exports.getById = async (req, res) => {
  const utente = await utentiModel.getById(req.params.id);
  if (!utente) return res.status(404).json({ message: 'Utente non trovato' });
  res.json(utente);
};

// Aggiorna utente (campi facoltativi)
exports.update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (data.password) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  const updated = await utentiModel.updateUtente(id, data);
  if (!updated) return res.status(404).json({ message: 'Utente non trovato o nessuna modifica' });
  res.json(updated);
};

// Elimina utente
exports.remove = async (req, res) => {
  const utente = await utentiModel.deleteUtente(req.params.id);
  if (!utente) return res.status(404).json({ message: 'Utente non trovato' });
  res.json({ message: 'Utente eliminato', utente });
};
