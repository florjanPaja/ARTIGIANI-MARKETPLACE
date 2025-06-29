const carrelloModel = require('../models/carrello.model');

// Recupera il carrello di un utente
exports.getCarrello = async (req, res) => {
  try {
    const carrello = await carrelloModel.getCarrello(req.params.id_utente);
    res.json(carrello);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante il recupero del carrello' });
  }
};

// Aggiunge o aggiorna articolo nel carrello
exports.aggiungiArticolo = async (req, res) => {
  const { id_utente, id_articolo, prezzo_unitario, quantita } = req.body;

  try {
    await carrelloModel.createCarrelloIfNotExist(id_utente);
    const riga = await carrelloModel.addOrUpdateArticolo(id_utente, id_articolo, prezzo_unitario, quantita);
    res.status(201).json(riga);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Errore durante l\'aggiunta al carrello' });
  }
};

// Rimuove un articolo dal carrello
exports.rimuoviArticolo = async (req, res) => {
  const { id_utente, id_articolo } = req.body;

  try {
    const eliminato = await carrelloModel.deleteArticolo(id_utente, id_articolo);
    if (!eliminato) return res.status(404).json({ message: 'Articolo non trovato nel carrello' });
    res.json({ message: 'Articolo rimosso dal carrello', eliminato });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante la rimozione dal carrello' });
  }
};

// ✅ Svuota tutto il carrello dell'utente
exports.svuotaCarrello = async (req, res) => {
  const { id_utente } = req.body;

  try {
    await carrelloModel.clearCarrello(id_utente);
    res.json({ message: 'Carrello svuotato con successo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante lo svuotamento del carrello' });
  }
};
