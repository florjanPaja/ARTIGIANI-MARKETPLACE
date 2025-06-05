const db = require('../config/db');

exports.create = async (data) => {
  const { id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code } = data;
  const result = await db.query(
    `INSERT INTO spedizioni (id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code]
  );
  return result.rows[0];
};
