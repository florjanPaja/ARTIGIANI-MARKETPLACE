const db = require('../config/db');

exports.createUtente = async (data) => {
  const { nome, cognome, email, password_hash, ruolo } = data;
  const result = await db.query(
    `INSERT INTO utenti (nome, cognome, email, password_hash, ruolo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, cognome, email, password_hash, ruolo]
  );
  return result.rows[0];
};

exports.getUtenteByEmail = async (email) => {
  const result = await db.query('SELECT * FROM utenti WHERE email = $1', [email]);
  return result.rows[0];
};
