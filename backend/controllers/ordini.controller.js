const ordiniModel = require('../models/ordini.model');

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

exports.getOrdiniUtente = async (req, res) => {
  const ordini = await ordiniModel.getOrdiniUtente(req.params.id_utente);
  res.json(ordini);
};
