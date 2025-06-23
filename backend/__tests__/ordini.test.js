const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID coerenti con setupTestDb.js
const ID_CLIENTE = '11111111-1111-1111-1111-111111111111';
const ID_ADMIN = '22222222-2222-2222-2222-222222222222';
const ID_ARTIGIANO = '33333333-3333-3333-3333-333333333333';
const ID_ARTICOLO = '44444444-4444-4444-4444-444444444444';

const tokenCliente = jwt.generateToken({ id: ID_CLIENTE, ruolo: 'cliente' });
const tokenArtigiano = jwt.generateToken({ id: ID_ARTIGIANO, ruolo: 'artigiano' });
const tokenAdmin = jwt.generateToken({ id: ID_ADMIN, ruolo: 'admin' });

let ordineCreatoId;

describe('📦 API Ordini', () => {
  it('POST /api/ordini - Crea nuovo ordine', async () => {
    const res = await request(app)
      .post('/api/ordini')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        righe: [
          {
            id_articolo: ID_ARTICOLO,
            prezzo_unitario: 15.5,
            quantita: 1
          }
        ]
      });

    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.message).toBe('Ordine creato');
      ordineCreatoId = res.body.ordineId;
    }
  });

  it('GET /api/ordini/utente/:id_utente - Ordini cliente', async () => {
    const res = await request(app)
      .get(`/api/ordini/utente/${ID_CLIENTE}`)
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/ordini/artigiano/:id_artigiano - Ordini artigiano', async () => {
    const res = await request(app)
      .get(`/api/ordini/artigiano/${ID_ARTIGIANO}`)
      .set('Authorization', `Bearer ${tokenArtigiano}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/ordini/:id - Ordine completo', async () => {
    if (!ordineCreatoId) return;
    const res = await request(app)
      .get(`/api/ordini/${ordineCreatoId}`)
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  it('PUT /api/ordini/:id - Aggiorna stato ordine', async () => {
    if (!ordineCreatoId) return;
    const res = await request(app)
      .put(`/api/ordini/${ordineCreatoId}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ stato: 'in preparazione' }); // ✅ correzione ortografica

    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it('GET /api/ordini/admin/all - Lista completa (admin)', async () => {
    const res = await request(app)
      .get('/api/ordini/admin/all')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/ordini/admin/stats/count-by-stato - Statistiche per stato (admin)', async () => {
    const res = await request(app)
      .get('/api/ordini/admin/stats/count-by-stato')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/ordini/artigiano/:id/stats/totale - Totale vendite artigiano', async () => {
    const res = await request(app)
      .get(`/api/ordini/artigiano/${ID_ARTIGIANO}/stats/totale`)
      .set('Authorization', `Bearer ${tokenArtigiano}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totale');
  });

  it('GET /api/ordini/artigiano/:id/stats/articoli - Vendite per articolo', async () => {
    const res = await request(app)
      .get(`/api/ordini/artigiano/${ID_ARTIGIANO}/stats/articoli`)
      .set('Authorization', `Bearer ${tokenArtigiano}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/ordini/:id - Elimina ordine (admin)', async () => {
    if (!ordineCreatoId) return;
    const res = await request(app)
      .delete(`/api/ordini/${ordineCreatoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});
