const db = require('../config/db');

// Crea testata ordine
exports.createTestataOrdine = async (id_utente, stato = 'in_attesa') => {
  const result = await db.query(
    `INSERT INTO testata_ordine (id_utente, stato)
     VALUES ($1, $2) RETURNING *`,
    [id_utente, stato]
  );
  return result.rows[0];
};

// Aggiunge riga ordine
exports.addRigaOrdine = async (id_testata, id_articolo, prezzo_unitario, quantita) => {
  const result = await db.query(
    `INSERT INTO riga_ordine (id_testata, id_articolo, prezzo_unitario, quantita)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_testata, id_articolo, prezzo_unitario, quantita]
  );
  return result.rows[0];
};

// Ordini di un utente
exports.getOrdiniUtente = async (id_utente) => {
  const result = await db.query(
    `SELECT * FROM testata_ordine WHERE id_utente = $1 ORDER BY data_ordine DESC`,
    [id_utente]
  );
  return result.rows;
};

// Ordine completo (testata + righe)
exports.getOrdineCompleto = async (id_ordine) => {
  const testata = await db.query(`SELECT * FROM testata_ordine WHERE id = $1`, [id_ordine]);
  const righe = await db.query(`SELECT * FROM riga_ordine WHERE id_testata = $1`, [id_ordine]);

  if (testata.rowCount === 0) return null;

  return {
    testata: testata.rows[0],
    righe: righe.rows
  };
};

// Tutti gli ordini (es. per admin)
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM testata_ordine ORDER BY data_ordine DESC');
  return result.rows;
};

// Aggiorna stato ordine
exports.updateStatoOrdine = async (id, stato) => {
  const result = await db.query(
    `UPDATE testata_ordine SET stato = $1 WHERE id = $2 RETURNING *`,
    [stato, id]
  );
  return result.rows[0];
};

// Cancella un ordine
exports.deleteOrdine = async (id) => {
  const result = await db.query(
    `DELETE FROM testata_ordine WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
