const db = require('../config/db');

exports.getCarrello = async (id_utente) => {
  const result = await db.query(
    `SELECT rc.*, a.nome FROM riga_carrello rc
     JOIN testata_carrello tc ON rc.id_testata = tc.id
     JOIN articoli a ON rc.id_articolo = a.id
     WHERE tc.id_utente = $1`,
    [id_utente]
  );
  return result.rows;
};

exports.addArticolo = async (id_testata, id_articolo, prezzo_unitario, quantita) => {
  const result = await db.query(
    `INSERT INTO riga_carrello (id_testata, id_articolo, prezzo_unitario, quantita)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id_testata, id_articolo, prezzo_unitario, quantita]
  );
  return result.rows[0];
};

exports.createCarrelloIfNotExist = async (id_utente) => {
  const check = await db.query(`SELECT * FROM testata_carrello WHERE id_utente = $1`, [id_utente]);
  if (check.rowCount === 0) {
    await db.query(`INSERT INTO testata_carrello (id_utente) VALUES ($1)`, [id_utente]);
  }
};
