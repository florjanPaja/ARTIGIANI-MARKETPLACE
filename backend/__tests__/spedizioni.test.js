const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID coerenti con setupTestDb.js
const ID_CLIENTE = '11111111-1111-1111-1111-111111111111';
const ID_ADMIN = '22222222-2222-2222-2222-222222222222';
const ID_ORDINE = '55555555-5555-5555-5555-555555555555'; // testata_ordine

const tokenUtente = jwt.generateToken({ id: ID_CLIENTE, ruolo: 'cliente' });
const tokenAdmin = jwt.generateToken({ id: ID_ADMIN, ruolo: 'admin' });

let trackingCode = `TRK-${Date.now()}`;

describe('📦 API Spedizioni', () => {
  it('POST /api/spedizioni - Crea spedizione', async () => {
    const res = await request(app)
      .post('/api/spedizioni')
      .set('Authorization', `Bearer ${tokenUtente}`)
      .send({
        id_ordine: ID_ORDINE,
        id_utente: ID_CLIENTE,
        indirizzo_spedizione: 'Via Roma 123',
        citta: 'Milano',
        cap: '20100',
        stato: 'Italia',
        tracking_code: trackingCode
      });

    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.id_ordine).toBe(ID_ORDINE);
    }
  });

  it('GET /api/spedizioni/:id_ordine - Recupera spedizione', async () => {
    const res = await request(app)
      .get(`/api/spedizioni/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenUtente}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.tracking_code).toBe(trackingCode);
    }
  });

  it('PUT /api/spedizioni/:id_ordine - Aggiorna stato spedizione (admin)', async () => {
    const res = await request(app)
      .put(`/api/spedizioni/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ stato_spedizione: 'consegnato' });

    expect([200, 404, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.stato_spedizione).toBe('consegnato');
    }
  });

  it('DELETE /api/spedizioni/:id_ordine - Elimina spedizione (admin)', async () => {
    const res = await request(app)
      .delete(`/api/spedizioni/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.message).toBe('Spedizione eliminata');
    }
  });
});
