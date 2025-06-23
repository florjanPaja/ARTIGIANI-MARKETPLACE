const model = require('../models/articoli.model');
const fs = require('fs');
const path = require('path');
const articoliModel = require('../models/articoli.model');

// 🔹 Lista tutti gli articoli
exports.list = async (_req, res) => {
  try {
    const data = await model.getAll();
    res.json(data);
  } catch (err) {
    console.error('Errore list:', err);
    res.status(500).json({ message: 'Errore recupero articoli' });
  }
};

// 🔹 Articolo per ID
exports.getById = async (req, res) => {
  try {
    const articolo = await model.getById(req.params.id);
    if (!articolo) return res.status(404).json({ message: 'Articolo non trovato' });
    res.json(articolo);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno' });
  }
};

// 🔹 Articoli per artigiano
exports.getByArtigiano = async (req, res) => {
  try {
    const lista = await model.getByArtigiano(req.params.id_artigiano);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno' });
  }
};

// 🔹 Crea un nuovo articolo
exports.create = async (req, res) => {
  try {
    const immagini = req.files?.map(f => `/img/${f.filename}`) || [];
    const data = {
      ...req.body,
      immagini,
      id_artigiano: req.user.id // vincolato all’artigiano loggato
    };
    const creato = await model.create(data);
    res.status(201).json(creato);
  } catch (err) {
    console.error('Errore creazione:', err);
    res.status(500).json({ message: 'Errore creazione articolo' });
  }
};

// 🔹 Aggiorna articolo
exports.update = async (req, res) => {
  try {
    const immaginiCaricate = req.files?.map(f => `/img/${f.filename}`) || [];
    const immaginiEsistenti = JSON.parse(req.body.immaginiEsistenti || '[]');
    const immaginiDaRimuovere = JSON.parse(req.body.immaginiDaRimuovere || '[]');

    const old = await model.getById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Articolo non trovato' });

    if (req.user.ruolo !== 'admin' && req.user.id !== old.id_artigiano) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    // Salviamo solo il campo immagini nel DB
    const data = {
      ...req.body,
      immagini: [...immaginiEsistenti, ...immaginiCaricate]
    };

    const updated = await model.updateArticolo(req.params.id, data);

    // elimina le immagini fisiche da rimuovere
    immaginiDaRimuovere.forEach(img => {
      const fullPath = path.join(__dirname, '..', img);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    res.json(updated);
  } catch (err) {
    console.error('Errore update:', err);
    res.status(500).json({ message: 'Errore aggiornamento' });
  }
};

// 🔹 Elimina articolo
exports.remove = async (req, res) => {
  try {
    const old = await model.getById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Articolo non trovato' });

    if (req.user.ruolo !== 'admin' && req.user.id !== old.id_artigiano) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    const rimosso = await model.deleteArticolo(req.params.id);
    rimosso.immagini?.forEach(img => {
      const fullPath = path.join(__dirname, '..', img);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    res.json({ message: 'Articolo eliminato', rimosso });
  } catch (err) {
    res.status(500).json({ message: 'Errore eliminazione' });
  }
};

// 🔹 Ricerca articoli
exports.search = async (req, res) => {
  try {
    const risultati = await model.search(req.query.q || '');
    res.json(risultati);
  } catch (err) {
    res.status(500).json({ message: 'Errore ricerca' });
  }
};

// 🔹 Statistiche globali
exports.stats = async (_req, res) => {
  try {
    const stats = await model.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Errore statistiche' });
  }
};

// 🔹 Statistiche per artigiano
exports.statsByArtigiano = async (req, res) => {
  try {
    const stats = await articoliModel.getStatsByArtigiano(req.user.id);
    res.json(stats);
  } catch (err) {
    console.error('Errore statistiche artigiano:', err);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche' });
  }
};
