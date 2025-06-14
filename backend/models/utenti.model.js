const db = require('../config/db');

// Crea un nuovo utente
exports.createUtente = async (data) => {
  const { nome, cognome, email, password_hash, ruolo } = data;
  const result = await db.query(
    `INSERT INTO utenti (nome, cognome, email, password_hash, ruolo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, cognome, email, password_hash, ruolo]
  );
  return result.rows[0];
};

// Recupera utente via email
exports.getUtenteByEmail = async (email) => {
  const result = await db.query('SELECT * FROM utenti WHERE email = $1', [email]);
  return result.rows[0];
};

// Recupera utente per ID
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM utenti WHERE id = $1', [id]);
  return result.rows[0];
};

// Lista tutti gli utenti
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM utenti');
  return result.rows;
};

// Aggiorna utente (solo campi presenti)
exports.updateUtente = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }
  }

  if (fields.length === 0) return null;

  const query = `UPDATE utenti SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  values.push(id);

  const result = await db.query(query, values);
  return result.rows[0];
};

// Elimina utente
exports.deleteUtente = async (id) => {
  const result = await db.query('DELETE FROM utenti WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
