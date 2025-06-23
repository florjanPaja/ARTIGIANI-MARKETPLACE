const db = require('../config/db');

// Crea testata carrello se non esiste
exports.createCarrelloIfNotExist = async (id_utente) => {
  const check = await db.query(
    `SELECT id FROM testata_carrello WHERE id_utente = $1`,
    [id_utente]
  );
  if (check.rowCount === 0) {
    await db.query(`INSERT INTO testata_carrello (id_utente) VALUES ($1)`, [id_utente]);
  }
};

// Recupera il carrello completo con articoli
exports.getCarrello = async (id_utente) => {
  const result = await db.query(
    `SELECT rc.*, a.nome, a.disponibilita, a.prezzo AS prezzo_originale
     FROM riga_carrello rc
     JOIN testata_carrello tc ON rc.id_testata = tc.id
     JOIN articoli a ON rc.id_articolo = a.id
     WHERE tc.id_utente = $1
     ORDER BY a.id`,
    [id_utente]
  );
  return result.rows;
};

// Aggiunge, aggiorna o rimuove (se quantità = 0) una riga carrello
exports.addOrUpdateArticolo = async (id_utente, id_articolo, prezzo_unitario, quantita) => {
  const { rows: testataRows } = await db.query(
    'SELECT id FROM testata_carrello WHERE id_utente = $1',
    [id_utente]
  );
  if (testataRows.length === 0) throw new Error('Testata carrello non trovata');
  const id_testata = testataRows[0].id;

  const { rows: articoloRows } = await db.query(
    'SELECT disponibilita FROM articoli WHERE id = $1',
    [id_articolo]
  );
  if (articoloRows.length === 0) throw new Error('Articolo non trovato');
  const disponibilita = parseInt(articoloRows[0].disponibilita);

  const { rows: existingRows } = await db.query(
    `SELECT quantita FROM riga_carrello WHERE id_testata = $1 AND id_articolo = $2`,
    [id_testata, id_articolo]
  );

  // Se quantità = 0 ➜ rimuove la riga se esiste
  if (quantita === 0) {
    if (existingRows.length > 0) {
      await db.query(
        `DELETE FROM riga_carrello WHERE id_testata = $1 AND id_articolo = $2`,
        [id_testata, id_articolo]
      );
    }
    return null;
  }

  if (quantita > disponibilita) {
    throw new Error(`Disponibilità insufficiente (max: ${disponibilita})`);
  }

  if (existingRows.length > 0) {
    const result = await db.query(
      `UPDATE riga_carrello SET quantita = $1
       WHERE id_testata = $2 AND id_articolo = $3
       RETURNING *`,
      [quantita, id_testata, id_articolo]
    );
    return result.rows[0];
  } else {
    const result = await db.query(
      `INSERT INTO riga_carrello (id_testata, id_articolo, prezzo_unitario, quantita)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_testata, id_articolo, prezzo_unitario, quantita]
    );
    return result.rows[0];
  }
};

// Rimuove una riga carrello specifica
exports.deleteArticolo = async (id_utente, id_articolo) => {
  const { rows: testataRows } = await db.query(
    'SELECT id FROM testata_carrello WHERE id_utente = $1',
    [id_utente]
  );
  if (testataRows.length === 0) return null;

  const id_testata = testataRows[0].id;

  const result = await db.query(
    `DELETE FROM riga_carrello
     WHERE id_testata = $1 AND id_articolo = $2
     RETURNING *`,
    [id_testata, id_articolo]
  );

  return result.rows[0];
};

// Svuota completamente il carrello
exports.clearCarrello = async (id_utente) => {
  const { rows: testataRows } = await db.query(
    'SELECT id FROM testata_carrello WHERE id_utente = $1',
    [id_utente]
  );
  if (testataRows.length === 0) return;

  const id_testata = testataRows[0].id;

  await db.query(
    `DELETE FROM riga_carrello WHERE id_testata = $1`,
    [id_testata]
  );
};
