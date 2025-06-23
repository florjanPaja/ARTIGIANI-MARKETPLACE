const db = require('../config/db');

// ✅ Crea ordine (testata)
exports.createOrdine = async (id_utente, stato = 'pagato') => {
  const { rows } = await db.query(`
    INSERT INTO testata_ordine (id_utente, stato)
    VALUES ($1, $2)
    RETURNING *`, [id_utente, stato]);
  return rows[0];
};

//Aggiunge riga ordine e aggiorna disponibilità articolo
exports.addRiga = async ({ id_testata, id_articolo, prezzo_unitario, quantita }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Inserisci la riga ordine
    const riga = await client.query(`
      INSERT INTO riga_ordine (id_testata, id_articolo, prezzo_unitario, quantita)
      VALUES ($1, $2, $3, $4)
      RETURNING *`, [id_testata, id_articolo, prezzo_unitario, quantita]);

    // Decrementa la disponibilità dell'articolo
    await client.query(`
      UPDATE articoli
      SET disponibilita = disponibilita - $1
      WHERE id = $2 AND disponibilita >= $1`, [quantita, id_articolo]);

    await client.query('COMMIT');
    return riga.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ✅ Tutti gli ordini (admin)
exports.getAll = async () => {
  const { rows } = await db.query(`
    SELECT t.id, t.data_ordine, t.stato,
           u.nome || ' ' || u.cognome AS cliente,
           COALESCE(SUM(r.totale_riga), 0) AS totale
    FROM testata_ordine t
    JOIN utenti u ON u.id = t.id_utente
    LEFT JOIN riga_ordine r ON r.id_testata = t.id
    GROUP BY t.id, u.nome, u.cognome
    ORDER BY t.data_ordine DESC`);
  return rows;
};

// ✅ Ordini per utente
exports.getByUtente = async (id_utente) => {
  const { rows } = await db.query(`
    SELECT t.id, t.data_ordine, t.stato,
           COALESCE(SUM(r.totale_riga), 0) AS totale
    FROM testata_ordine t
    LEFT JOIN riga_ordine r ON r.id_testata = t.id
    WHERE t.id_utente = $1
    GROUP BY t.id
    ORDER BY t.data_ordine DESC`, [id_utente]);
  return rows;
};

// ✅ Ordini con articoli di un artigiano
exports.getByArtigiano = async (id_artigiano) => {
  const { rows } = await db.query(`
    SELECT DISTINCT t.id, t.data_ordine, t.stato,
           u.nome || ' ' || u.cognome AS cliente
    FROM testata_ordine t
    JOIN utenti u ON u.id = t.id_utente
    JOIN riga_ordine r ON r.id_testata = t.id
    JOIN articoli a ON a.id = r.id_articolo
    WHERE a.id_artigiano = $1
    ORDER BY t.data_ordine DESC`, [id_artigiano]);
  return rows;
};

// ✅ Ordine completo
exports.getCompleto = async (id) => {
  const testata = await db.query(`SELECT * FROM testata_ordine WHERE id = $1`, [id]);
  const righe = await db.query(`
    SELECT r.*, a.nome AS nome_articolo
    FROM riga_ordine r
    JOIN articoli a ON a.id = r.id_articolo
    WHERE r.id_testata = $1`, [id]);

  if (testata.rowCount === 0) return null;
  return { ...testata.rows[0], righe: righe.rows };
};

// ✅ Aggiorna stato ordine
exports.updateStato = async (id, stato) => {
  const { rows } = await db.query(`
    UPDATE testata_ordine
    SET stato = $1
    WHERE id = $2
    RETURNING *`, [stato, id]);
  return rows[0];
};

// ✅ Elimina ordine
exports.remove = async (id) => {
  const { rows } = await db.query(`
    DELETE FROM testata_ordine WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
};

// ✅ Conteggio ordini per stato
exports.countByStato = async () => {
  const { rows } = await db.query(`
    SELECT stato, COUNT(*) AS totale
    FROM testata_ordine
    GROUP BY stato`);
  return rows;
};

// ✅ Totale vendite artigiano
exports.totaleVenditeArtigiano = async (id_artigiano) => {
  const { rows } = await db.query(`
    SELECT SUM(r.totale_riga) AS totale_vendite
    FROM riga_ordine r
    JOIN articoli a ON a.id = r.id_articolo
    WHERE a.id_artigiano = $1`, [id_artigiano]);
  return rows[0]?.totale_vendite || 0;
};

// ✅ Vendite per articolo
exports.venditePerArticolo = async (id_artigiano) => {
  const { rows } = await db.query(`
    SELECT a.nome, SUM(r.quantita) AS pezzi_venduti, SUM(r.totale_riga) AS incasso
    FROM riga_ordine r
    JOIN articoli a ON a.id = r.id_articolo
    WHERE a.id_artigiano = $1
    GROUP BY a.id, a.nome
    ORDER BY incasso DESC`, [id_artigiano]);
  return rows;
};
