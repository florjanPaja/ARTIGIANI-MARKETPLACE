const db = require('../config/db');

// Crea una spedizione
exports.create = async (data) => {
  const { id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code } = data;
  const result = await db.query(
    `INSERT INTO spedizioni (id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code]
  );
  return result.rows[0];
};

// Recupera spedizione per ordine
exports.getByOrdine = async (id_ordine) => {
  const result = await db.query(
    `SELECT * FROM spedizioni WHERE id_ordine = $1`,
    [id_ordine]
  );
  return result.rows[0];
};

// Aggiorna stato spedizione (es. in_preparazione → spedito → consegnato)
exports.updateStato = async (id_ordine, stato_spedizione) => {
  const result = await db.query(
    `UPDATE spedizioni SET stato_spedizione = $1 WHERE id_ordine = $2 RETURNING *`,
    [stato_spedizione, id_ordine]
  );
  return result.rows[0];
};

// Elimina spedizione
exports.deleteByOrdine = async (id_ordine) => {
  const result = await db.query(
    `DELETE FROM spedizioni WHERE id_ordine = $1 RETURNING *`,
    [id_ordine]
  );
  return result.rows[0];
};
