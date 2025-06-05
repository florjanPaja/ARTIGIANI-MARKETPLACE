const bcrypt = require('bcrypt');
const utentiModel = require('../models/utenti.model');

exports.register = async (req, res) => {
  const data = req.body;
  data.password_hash = await bcrypt.hash(data.password, 10);
  const utente = await utentiModel.createUtente(data);
  res.status(201).json(utente);
};
