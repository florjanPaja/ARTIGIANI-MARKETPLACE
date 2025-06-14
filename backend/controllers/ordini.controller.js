const ordiniModel = require('../models/ordini.model');

// Crea un nuovo ordine con righe
exports.createOrdine = async (req, res) => {
  const { id_utente, righe } = req.body;

  const testata = await ordiniModel.createTestataOrdine(id_utente);

  for (const riga of righe) {
    await ordiniModel.addRigaOrdine(
      testata.id,
      riga.id_articolo,
      riga.prezzo_unitario,
      riga.quantita
    );
  }

  res.status(201).json({ ordine: testata });
};

// Recupera tutti gli ordini per utente
exports.getOrdiniUtente = async (req, res) => {
  const ordini = await ordiniModel.getOrdiniUtente(req.params.id_utente);
  res.json(ordini);
};

// Recupera ordine completo: testata + righe
exports.getOrdineCompleto = async (req, res) => {
  const ordine = await ordiniModel.getOrdineCompleto(req.params.id);
  if (!ordine) return res.status(404).json({ message: 'Ordine non trovato' });
  res.json(ordine);
};

// Lista tutti gli ordini (admin)
exports.listAll = async (_req, res) => {
  const ordini = await ordiniModel.getAll();
  res.json(ordini);
};

// Aggiorna lo stato dell'ordine
exports.updateStato = async (req, res) => {
  const { stato } = req.body;
  const ordine = await ordiniModel.updateStatoOrdine(req.params.id, stato);
  if (!ordine) return res.status(404).json({ message: 'Ordine non trovato' });
  res.json(ordine);
};

// Elimina un ordine
exports.remove = async (req, res) => {
  const ordine = await ordiniModel.deleteOrdine(req.params.id);
  if (!ordine) return res.status(404).json({ message: 'Ordine non trovato' });
  res.json({ message: 'Ordine eliminato', ordine });
};
