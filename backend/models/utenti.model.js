const db = require('../config/db');

// 🔹 Crea un nuovo utente
exports.createUtente = async (data) => {
  const {
    nome, cognome, email, password_hash, ruolo,
    telefono = null, indirizzo = null, citta = null, cap = null, stato = null,
    nome_attivita = null, partita_iva = null, bio = null, sito_web = null
  } = data;

  const result = await db.query(
    `INSERT INTO utenti (
      nome, cognome, email, password_hash, ruolo,
      telefono, indirizzo, citta, cap, stato,
      nome_attivita, partita_iva, bio, sito_web
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *`,
    [nome, cognome, email, password_hash, ruolo,
     telefono, indirizzo, citta, cap, stato,
     nome_attivita, partita_iva, bio, sito_web]
  );
  return result.rows[0];
};

// 🔹 Recupera tutti gli utenti (admin only)
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM utenti ORDER BY data_creazione DESC');
  return result.rows;
};

// 🔹 Recupera utente per ID
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM utenti WHERE id = $1', [id]);
  return result.rows[0];
};

// 🔹 Recupera utente per email (login)
exports.getUtenteByEmail = async (email) => {
  const result = await db.query('SELECT * FROM utenti WHERE email = $1', [email]);
  return result.rows[0];
};

// 🔹 Aggiorna utente
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

  const query = `
    UPDATE utenti SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *`;
  values.push(id);

  const result = await db.query(query, values);
  return result.rows[0];
};

// 🔹 Elimina utente
exports.deleteUtente = async (id) => {
  const result = await db.query('DELETE FROM utenti WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// 🔹 Statistiche globali (admin)
exports.getStats = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE ruolo = 'cliente') AS clienti,
      COUNT(*) FILTER (WHERE ruolo = 'artigiano') AS artigiani,
      COUNT(*) FILTER (WHERE ruolo = 'admin') AS admin
    FROM utenti
  `);
  return result.rows[0];
};

// 🔹 Statistiche profilo artigiano (singolo)
exports.getProfiloPubblico = async (id) => {
  const result = await db.query(`
    SELECT id, nome_attivita, bio, sito_web, citta, stato
    FROM utenti
    WHERE id = $1 AND ruolo = 'artigiano'
  `, [id]);
  return result.rows[0];
};
