const spedizioniModel = require('../models/spedizioni.model');

exports.creaSpedizione = async (req, res) => {
  const spedizione = await spedizioniModel.create(req.body);
  res.status(201).json(spedizione);
};
