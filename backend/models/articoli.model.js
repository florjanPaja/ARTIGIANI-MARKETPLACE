const db = require('../config/db');

// 🔹 Lista tutti gli articoli
exports.getAll = async () => {
  const result = await db.query('SELECT * FROM articoli ORDER BY data_creazione DESC');
  return result.rows;
};

// 🔹 Articolo per ID
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM articoli WHERE id = $1', [id]);
  return result.rows[0];
};

// 🔹 Articoli per artigiano
exports.getByArtigiano = async (id_artigiano) => {
  const result = await db.query(
    'SELECT * FROM articoli WHERE id_artigiano = $1 ORDER BY data_creazione DESC',
    [id_artigiano]
  );
  return result.rows;
};

// 🔹 Crea un nuovo articolo
exports.create = async (data) => {
  const {
    id_artigiano,
    nome,
    descrizione = '',
    prezzo,
    disponibilita,
    categoria = '',
    sconto_percentuale = null,
    in_sconto = false,
    data_inizio_sconto = null,
    data_fine_sconto = null,
    immagini = []
  } = data;

  const parsedPrezzo = parseFloat(prezzo);
  const parsedDisponibilita = parseInt(disponibilita);

  let parsedSconto = 0;
  if (sconto_percentuale !== undefined && sconto_percentuale !== '') {
    const tmp = parseFloat(sconto_percentuale);
    parsedSconto = isNaN(tmp) ? 0 : tmp;
  }

  const parsedInSconto = in_sconto === 'true' || in_sconto === true;

  if (!id_artigiano || !nome || isNaN(parsedPrezzo) || isNaN(parsedDisponibilita)) {
    throw new Error('Dati obbligatori mancanti per la creazione dell’articolo');
  }

  const result = await db.query(
    `INSERT INTO articoli (
      id_artigiano, nome, descrizione, prezzo, disponibilita,
      categoria, sconto_percentuale, in_sconto,
      data_inizio_sconto, data_fine_sconto, immagini
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      id_artigiano,
      nome,
      descrizione,
      parsedPrezzo,
      parsedDisponibilita,
      categoria,
      parsedSconto,
      parsedInSconto,
      data_inizio_sconto || null,
      data_fine_sconto || null,
      JSON.stringify(immagini)
    ]
  );

  return result.rows[0];
};

// 🔹 Aggiorna articolo
exports.updateArticolo = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    // Saltiamo eventuali campi non esistenti
    if (!['nome', 'descrizione', 'prezzo', 'disponibilita', 'categoria', 'sconto_percentuale',
          'in_sconto', 'data_inizio_sconto', 'data_fine_sconto', 'immagini'].includes(key)) {
      continue;
    }

    if (data[key] !== undefined) {
      let value = data[key];

      if (key === 'prezzo') value = parseFloat(value);
      if (key === 'disponibilita') value = parseInt(value);
      if (key === 'sconto_percentuale') value = parseFloat(value);
      if (key === 'in_sconto') value = value === 'true' || value === true;
      if (key === 'immagini' && Array.isArray(value)) value = JSON.stringify(value);

      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE articoli
    SET ${fields.join(', ')}, data_creazione = data_creazione
    WHERE id = $${index}
    RETURNING *`;
  values.push(id);

  const result = await db.query(query, values);
  return result.rows[0];
};

// 🔹 Elimina articolo
exports.deleteArticolo = async (id) => {
  const result = await db.query('DELETE FROM articoli WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// 🔹 Ricerca
exports.search = async (query) => {
  const result = await db.query(
    `SELECT * FROM articoli
     WHERE nome ILIKE $1 OR descrizione ILIKE $1 OR categoria ILIKE $1
     ORDER BY data_creazione DESC`,
    [`%${query}%`]
  );
  return result.rows;
};

// 🔹 Statistiche globali
exports.getStats = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) AS totale_prodotti,
      COUNT(*) FILTER (WHERE disponibilita = 0) AS esauriti,
      COUNT(*) FILTER (WHERE in_sconto = true) AS in_sconto
    FROM articoli
  `);
  return result.rows[0];
};

// 🔹 Statistiche per artigiano
exports.getStatsByArtigiano = async (id_artigiano) => {
  const result = await db.query(
    `SELECT
      COUNT(*) AS totale,
      COUNT(*) FILTER (WHERE disponibilita = 0) AS esauriti,
      COUNT(*) FILTER (WHERE in_sconto = true) AS in_sconto
     FROM articoli
     WHERE id_artigiano = $1`,
    [id_artigiano]
  );
  return result.rows[0];
};
