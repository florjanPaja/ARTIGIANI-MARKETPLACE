const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const utentiModel = require('../models/utenti.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const utente = await utentiModel.getUtenteByEmail(email);
  if (!utente) return res.status(404).json({ message: 'Utente non trovato' });

  const match = await bcrypt.compare(password, utente.password_hash);
  if (!match) return res.status(401).json({ message: 'Password errata' });

  const token = jwt.generateToken({ id: utente.id, ruolo: utente.ruolo });
  res.json({ token });
};
