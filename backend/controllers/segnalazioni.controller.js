const Segnalazioni = require('../models/segnalazioni.model');

exports.creaSegnalazione = async (req, res) => {
  try {
    const { oggetto, messaggio } = req.body;
    const idUtente = req.user?.id;

    if (!idUtente || !oggetto || !messaggio) {
      return res.status(400).json({ error: 'Oggetto e messaggio sono obbligatori.' });
    }

    const segnalazione = await Segnalazioni.creaSegnalazione(idUtente, oggetto, messaggio);
    res.status(201).json(segnalazione);
  } catch (error) {
    console.error('❌ Errore creaSegnalazione:', error);
    res.status(500).json({ error: 'Errore nella creazione della segnalazione.' });
  }
};




exports.aggiungiMessaggio = async (req, res) => {
  try {
    const { id } = req.params;
    const { messaggio, mittente } = req.body;
    if (!messaggio || !['admin', 'utente'].includes(mittente)) {
      return res.status(400).json({ error: 'Mittente o messaggio non validi.' });
    }
    const nuovoMessaggio = await Segnalazioni.aggiungiMessaggio(id, mittente, messaggio);
    res.status(201).json(nuovoMessaggio);
  } catch (err) {
    console.error('Errore aggiungiMessaggio:', err);
    res.status(500).json({ error: 'Errore nell\'aggiunta del messaggio.' });
  }
};

exports.getMessaggi = async (req, res) => {
  try {
    const { id } = req.params;
    const messaggi = await Segnalazioni.getMessaggi(id);
    res.json(messaggi);
  } catch (err) {
    console.error('Errore getMessaggi:', err);
    res.status(500).json({ error: 'Errore nel recupero dei messaggi.' });
  }
};

exports.aggiornaStato = async (req, res) => {
  try {
    const { id } = req.params;
    const { stato } = req.body;
    const validi = ['aperta', 'in_gestione', 'attesa_risposta_utente', 'risolta'];
    if (!validi.includes(stato)) {
      return res.status(400).json({ error: 'Stato non valido.' });
    }
    const segnalazione = await Segnalazioni.aggiornaStatoSegnalazione(id, stato);
    res.json(segnalazione);
  } catch (err) {
    console.error('Errore aggiornaStato:', err);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dello stato.' });
  }
};

exports.getSegnalazioniUtente = async (req, res) => {
  try {
    const { id } = req.params;
    const segnalazioni = await Segnalazioni.getSegnalazioniUtente(id);
    res.json(segnalazioni);
  } catch (err) {
    console.error('Errore getSegnalazioniUtente:', err);
    res.status(500).json({ error: 'Errore nel recupero delle segnalazioni.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const segnalazioni = await Segnalazioni.getAll();
    res.json(segnalazioni);
  } catch (err) {
    console.error('Errore getAll:', err);
    res.status(500).json({ error: 'Errore nel recupero delle segnalazioni.' });
  }
};
