const bcrypt = require('bcrypt');
const model = require('../models/utenti.model');

// 🔹 Registrazione utente
exports.register = async (req, res) => {
  try {
    const data = req.body;

    if (!data.password) {
      return res.status(400).json({ message: 'Password obbligatoria' });
    }

    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;

    const creato = await model.createUtente(data);
    res.status(201).json(creato);
  } catch (err) {
    console.error('Errore registrazione:', err);
    res.status(500).json({ message: 'Errore creazione utente' });
  }
};

// 🔹 Lista utenti (solo admin)
exports.list = async (_req, res) => {
  try {
    const utenti = await model.getAll();
    res.json(utenti);
  } catch (err) {
    res.status(500).json({ message: 'Errore recupero utenti' });
  }
};

// 🔹 Dettaglio utente (admin o sé stesso)
exports.getById = async (req, res) => {
  try {
    const utente = await model.getById(req.params.id);
    if (!utente) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(utente);
  } catch (err) {
    res.status(500).json({ message: 'Errore recupero profilo' });
  }
};

// 🔹 Aggiorna dati utente (sé stesso)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    const aggiornato = await model.updateUtente(id, data);
    if (!aggiornato) return res.status(404).json({ message: 'Utente non trovato o nessuna modifica' });
    res.json(aggiornato);
  } catch (err) {
    res.status(500).json({ message: 'Errore aggiornamento profilo' });
  }
};

// 🔹 Elimina utente (sé stesso o admin)
exports.remove = async (req, res) => {
  try {
    const utente = await model.deleteUtente(req.params.id);
    if (!utente) return res.status(404).json({ message: 'Utente non trovato' });
    res.json({ message: 'Utente eliminato', utente });
  } catch (err) {
    res.status(500).json({ message: 'Errore eliminazione' });
  }
};

// 🔹 Statistiche utenti (admin)
exports.stats = async (_req, res) => {
  try {
    const stats = await model.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Errore statistiche utenti' });
  }
};

// 🔹 Profilo pubblico artigiano
exports.getProfiloPubblico = async (req, res) => {
  try {
    const profilo = await model.getProfiloPubblico(req.params.id);
    if (!profilo) return res.status(404).json({ message: 'Profilo artigiano non trovato' });
    res.json(profilo);
  } catch (err) {
    res.status(500).json({ message: 'Errore caricamento profilo pubblico' });
  }
};
