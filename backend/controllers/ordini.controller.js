const Ordini = require('../models/ordini.model');

// ✅ Crea un ordine
exports.createOrdine = async (req, res) => {
  try {
    const id_utente = req.user.id;
    const righe = req.body.righe;

    if (!Array.isArray(righe) || righe.length === 0) {
      return res.status(400).json({ message: 'Righe ordine mancanti' });
    }

    for (const r of righe) {
      if (!r.id_articolo || !r.prezzo_unitario || !r.quantita) {
        return res.status(400).json({ message: 'Dati riga incompleti' });
      }
    }

    const ordine = await Ordini.createOrdine(id_utente);
    for (const r of righe) {
      await Ordini.addRiga({ id_testata: ordine.id, ...r });
    }

    return res.status(201).json({ message: 'Ordine creato', ordineId: ordine.id });
  } catch (err) {
    console.error('Errore createOrdine:', err);
    return res.status(500).json({ message: 'Errore durante la creazione dell\'ordine' });
  }
};

// ✅ Recupera ordini di un cliente
exports.getOrdiniUtente = async (req, res) => {
  try {
    const id = req.params.id_utente;
    const ordini = await Ordini.getByUtente(id);
    res.json(ordini);
  } catch (err) {
    console.error('Errore getOrdiniUtente:', err);
    res.status(500).json({ message: 'Errore nel recupero ordini utente' });
  }
};

// ✅ Recupera ordini di un artigiano
exports.getOrdiniArtigiano = async (req, res) => {
  try {
    const id = req.params.id_artigiano;
    const ordini = await Ordini.getByArtigiano(id);
    res.json(ordini);
  } catch (err) {
    console.error('Errore getOrdiniArtigiano:', err);
    res.status(500).json({ message: 'Errore nel recupero ordini artigiano' });
  }
};

// ✅ Recupera ordine completo
exports.getOrdineCompleto = async (req, res) => {
  try {
    const ordine = await Ordini.getCompleto(req.params.id);
    if (!ordine) return res.status(404).json({ message: 'Ordine non trovato' });
    res.json(ordine);
  } catch (err) {
    console.error('Errore getOrdineCompleto:', err);
    res.status(500).json({ message: 'Errore nel recupero ordine' });
  }
};

// ✅ Lista completa ordini (admin)
exports.listAll = async (_req, res) => {
  try {
    const ordini = await Ordini.getAll();
    res.json(ordini);
  } catch (err) {
    console.error('Errore listAll:', err);
    res.status(500).json({ message: 'Errore nel recupero ordini' });
  }
};

// ✅ Aggiorna stato ordine
exports.updateStato = async (req, res) => {
  try {
    const { stato } = req.body;
    const validi = [ 'pagato', 'in preparzione', 'spedito', 'annullato'];
    if (!validi.includes(stato)) {
      return res.status(400).json({ message: 'Stato non valido' });
    }
    const result = await Ordini.updateStato(req.params.id, stato);
    if (!result) return res.status(404).json({ message: 'Ordine non trovato' });
    res.json({ message: 'Stato aggiornato', ordine: result });
  } catch (err) {
    console.error('Errore updateStato:', err);
    res.status(500).json({ message: 'Errore aggiornamento stato' });
  }
};

// ✅ Elimina ordine
exports.remove = async (req, res) => {
  try {
    const result = await Ordini.remove(req.params.id);
    if (!result) return res.status(404).json({ message: 'Ordine non trovato' });
    res.json({ message: 'Ordine eliminato' });
  } catch (err) {
    console.error('Errore remove ordine:', err);
    res.status(500).json({ message: 'Errore eliminazione ordine' });
  }
};

// ✅ Statistiche per stato
exports.countByStato = async (_req, res) => {
  try {
    const result = await Ordini.countByStato();
    res.json(result);
  } catch (err) {
    console.error('Errore countByStato:', err);
    res.status(500).json({ message: 'Errore nel conteggio' });
  }
};

// ✅ Vendite totali artigiano
exports.venditeTotaliArtigiano = async (req, res) => {
  try {
    const totale = await Ordini.totaleVenditeArtigiano(req.params.id_artigiano);
    res.json({ totale });
  } catch (err) {
    console.error('Errore venditeTotaliArtigiano:', err);
    res.status(500).json({ message: 'Errore nel calcolo vendite' });
  }
};

// ✅ Vendite per articolo artigiano
exports.venditePerArticolo = async (req, res) => {
  try {
    const result = await Ordini.venditePerArticolo(req.params.id_artigiano);
    res.json(result);
  } catch (err) {
    console.error('Errore venditePerArticolo:', err);
    res.status(500).json({ message: 'Errore nel recupero vendite' });
  }
};
