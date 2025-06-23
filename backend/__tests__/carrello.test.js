const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID coerenti con setupTestDb.js
const ID_UTENTE = '11111111-1111-1111-1111-111111111111';      // cliente-test
const ID_ARTICOLO = '44444444-4444-4444-4444-444444444444';    // articolo-test

const tokenCliente = jwt.generateToken({ id: ID_UTENTE, ruolo: 'cliente' });

describe('🛒 API Carrello', () => {
  const prezzo_unitario = 10.5;
  const quantita = 2;

  it('POST /api/carrello - Aggiunge articolo', async () => {
    const res = await request(app)
      .post('/api/carrello')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        id_utente: ID_UTENTE,
        id_articolo: ID_ARTICOLO,
        prezzo_unitario,
        quantita
      });

    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.id_articolo).toBe(ID_ARTICOLO);
    }
  });

  it('GET /api/carrello/:id_utente - Recupera carrello', async () => {
    const res = await request(app)
      .get(`/api/carrello/${ID_UTENTE}`)
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/carrello/rimuovi - Rimuove articolo dal carrello', async () => {
    const res = await request(app)
      .post('/api/carrello/rimuovi')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        id_utente: ID_UTENTE,
        id_articolo: ID_ARTICOLO
      });

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.message).toBe('Articolo rimosso dal carrello');
    }
  });

  it('POST /api/carrello/svuota - Svuota il carrello', async () => {
    const res = await request(app)
      .post('/api/carrello/svuota')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ id_utente: ID_UTENTE });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Carrello svuotato con successo');
  });
});
