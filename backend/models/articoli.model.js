const db = require('../config/db');

exports.getAll = async () => {
  const result = await db.query('SELECT * FROM articoli');
  return result.rows;
};

exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM articoli WHERE id = $1', [id]);
  return result.rows[0];
};

exports.create = async (data) => {
  const { id_artigiano, nome, descrizione, prezzo, disponibilita, categoria, sconto_percentuale } = data;
  const result = await db.query(
    `INSERT INTO articoli (id_artigiano, nome, descrizione, prezzo, disponibilita, categoria, sconto_percentuale)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_artigiano, nome, descrizione, prezzo, disponibilita, categoria, sconto_percentuale]
  );
  return result.rows[0];
};
