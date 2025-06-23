const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

beforeAll(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 🔄 Svuota tutte le tabelle
    await client.query(`
      TRUNCATE
        segnalazione_messaggi,
        segnalazioni,
        riga_carrello,
        testata_carrello,
        spedizioni,
        pagamenti,
        riga_ordine,
        testata_ordine,
        articoli,
        utenti
      RESTART IDENTITY CASCADE;
    `);

    // 👤 Inserisci utenti
    await client.query(`
      INSERT INTO utenti (id, nome, cognome, email, password_hash, ruolo)
      VALUES
        ('11111111-1111-1111-1111-111111111111', 'Mario', 'Rossi', 'cliente@test.com', 'hash', 'cliente'),
        ('22222222-2222-2222-2222-222222222222', 'Anna', 'Admin', 'admin@test.com', 'hash', 'admin'),
        ('33333333-3333-3333-3333-333333333333', 'Luca', 'Bottega', 'artigiano@test.com', 'hash', 'artigiano');
    `);

    // 📦 Articolo
    await client.query(`
      INSERT INTO articoli (id, id_artigiano, nome, prezzo, disponibilita)
      VALUES (
        '44444444-4444-4444-4444-444444444444',
        '33333333-3333-3333-3333-333333333333',
        'Portachiavi',
        9.99,
        100
      );
    `);

    // 🛒 Carrello
    await client.query(`
      INSERT INTO testata_carrello (id_utente)
      VALUES ('11111111-1111-1111-1111-111111111111');
    `);

    // 🧾 Ordine
    await client.query(`
      INSERT INTO testata_ordine (id, id_utente, stato)
      VALUES (
        '55555555-5555-5555-5555-555555555555',
        '11111111-1111-1111-1111-111111111111',
        'pagato'
      );
    `);

    // 💳 Pagamento (opzionale: per test GET diretti)
    await client.query(`
      INSERT INTO pagamenti (id_ordine, importo, metodo_pagamento, stato_pagamento)
      VALUES (
        '55555555-5555-5555-5555-555555555555',
        49.99,
        'carta',
        'completato'
      );
    `);

    // 🚚 Spedizione (opzionale)
    await client.query(`
      INSERT INTO spedizioni (id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code, stato_spedizione)
      VALUES (
        '55555555-5555-5555-5555-555555555555',
        '11111111-1111-1111-1111-111111111111',
        'Via Roma 123',
        'Milano',
        '20100',
        'Italia',
        'TRK-TEST',
        'spedito'
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Database test pronto');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Errore setupTestDb:', err);
  } finally {
    client.release();
  }
});

afterAll(async () => {
  await pool.end();
});
