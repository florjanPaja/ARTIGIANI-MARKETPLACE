const db = require('../config/db');

exports.creaSegnalazione = async (idUtente, oggetto, messaggioIniziale) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows: [segnalazione] } = await client.query(`
      INSERT INTO segnalazioni (id_utente, oggetto, stato_segnalazione)
      VALUES ($1, $2, 'aperta')
      RETURNING *;
    `, [idUtente, oggetto]);

    await client.query(`
      INSERT INTO segnalazione_messaggi (id_segnalazione, mittente, messaggio)
      VALUES ($1, 'utente', $2);
    `, [segnalazione.id, messaggioIniziale]);

    await client.query('COMMIT');
    return segnalazione;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};




exports.aggiungiMessaggio = async (idSegnalazione, mittente, messaggio) => {
  const { rows } = await db.query(`
    INSERT INTO segnalazione_messaggi (id_segnalazione, mittente, messaggio)
    VALUES ($1, $2, $3)
    RETURNING mittente, messaggio, data_invio;
  `, [idSegnalazione, mittente, messaggio]);
  return rows[0];
};

exports.getMessaggi = async (idSegnalazione) => {
  const { rows } = await db.query(`
    SELECT mittente, messaggio, data_invio
    FROM segnalazione_messaggi
    WHERE id_segnalazione = $1
    ORDER BY data_invio ASC;
  `, [idSegnalazione]);
  return rows;
};

exports.aggiornaStatoSegnalazione = async (id, stato) => {
  const { rows } = await db.query(`
    UPDATE segnalazioni
    SET stato_segnalazione = $2
    WHERE id = $1
    RETURNING *;
  `, [id, stato]);
  return rows[0];
};

exports.getSegnalazioniUtente = async (idUtente) => {
  const { rows } = await db.query(`
    SELECT * FROM segnalazioni
    WHERE id_utente = $1
    ORDER BY data_creazione DESC;
  `, [idUtente]);
  return rows;
};

exports.getAll = async () => {
  const { rows } = await db.query(`
    SELECT * FROM segnalazioni
    ORDER BY data_creazione DESC;
  `);
  return rows;
};
