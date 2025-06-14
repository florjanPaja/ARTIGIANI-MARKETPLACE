const db = require('../config/db');

// Lista tutti gli articoli
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM articoli');
  return result.rows;
};

// Articolo per ID
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM articoli WHERE id = $1', [id]);
  return result.rows[0];
};

// Articoli per artigiano
exports.getByArtigiano = async (id_artigiano) => {
  const result = await db.query('SELECT * FROM articoli WHERE id_artigiano = $1', [id_artigiano]);
  return result.rows;
};

// Crea un nuovo articolo
exports.create = async (data) => {
  const {
    id_artigiano, nome, descrizione,
    prezzo, disponibilita, categoria, sconto_percentuale
  } = data;

  const result = await db.query(
    `INSERT INTO articoli (id_artigiano, nome, descrizione, prezzo, disponibilita, categoria, sconto_percentuale)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_artigiano, nome, descrizione, prezzo, disponibilita, categoria, sconto_percentuale]
  );

  return result.rows[0];
};

// Aggiorna un articolo con campi parziali
exports.updateArticolo = async (id, data) => {
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

  const query = `UPDATE articoli SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  values.push(id);

  const result = await db.query(query, values);
  return result.rows[0];
};

// Elimina un articolo
exports.deleteArticolo = async (id) => {
  const result = await db.query('DELETE FROM articoli WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Ricerca su nome, descrizione o categoria
exports.search = async (query) => {
  const result = await db.query(
    `SELECT * FROM articoli 
     WHERE nome ILIKE $1 OR descrizione ILIKE $1 OR categoria ILIKE $1`,
    [`%${query}%`]
  );
  return result.rows;
};
