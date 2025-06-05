const db = require('../config/db');

exports.createTestataOrdine = async (id_utente, stato = 'in_attesa') => {
  const result = await db.query(
    `INSERT INTO testata_ordine (id_utente, stato)
     VALUES ($1, $2) RETURNING *`,
    [id_utente, stato]
  );
  return result.rows[0];
};

exports.addRigaOrdine = async (id_testata, id_articolo, prezzo_unitario, quantita) => {
  const result = await db.query(
    `INSERT INTO riga_ordine (id_testata, id_articolo, prezzo_unitario, quantita)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_testata, id_articolo, prezzo_unitario, quantita]
  );
  return result.rows[0];
};

exports.getOrdiniUtente = async (id_utente) => {
  const result = await db.query(
    `SELECT * FROM testata_ordine WHERE id_utente = $1`,
    [id_utente]
  );
  return result.rows;
};
