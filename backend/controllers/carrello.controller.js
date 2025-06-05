const carrelloModel = require('../models/carrello.model');

exports.getCarrello = async (req, res) => {
  const carrello = await carrelloModel.getCarrello(req.params.id_utente);
  res.json(carrello);
};

exports.aggiungiArticolo = async (req, res) => {
  const { id_utente, id_articolo, prezzo_unitario, quantita } = req.body;
  await carrelloModel.createCarrelloIfNotExist(id_utente);

  const testata = await carrelloModel.getCarrello(id_utente);
  const testataId = testata.length > 0 ? testata[0].id_testata : null;

  if (testataId) {
    const articolo = await carrelloModel.addArticolo(testataId, id_articolo, prezzo_unitario, quantita);
    res.status(201).json(articolo);
  } else {
    res.status(500).json({ message: 'Errore nella creazione del carrello' });
  }
};
