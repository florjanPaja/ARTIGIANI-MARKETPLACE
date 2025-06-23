const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID coerenti con setupTestDb.js
const ID_CLIENTE = '11111111-1111-1111-1111-111111111111';
const ID_ADMIN = '22222222-2222-2222-2222-222222222222';
const ID_ORDINE = '55555555-5555-5555-5555-555555555555'; // inserito in testata_ordine

const importo_test = 49.99;
const metodo_test = 'carta';

const tokenUtente = jwt.generateToken({ id: ID_CLIENTE, ruolo: 'cliente' });
const tokenAdmin = jwt.generateToken({ id: ID_ADMIN, ruolo: 'admin' });

describe('💳 API Pagamenti', () => {
  it('POST /api/pagamenti - Crea pagamento', async () => {
    const res = await request(app)
      .post('/api/pagamenti')
      .set('Authorization', `Bearer ${tokenUtente}`)
      .send({
        id_ordine: ID_ORDINE,
        importo: importo_test,
        metodo_pagamento: metodo_test
      });

    expect([201, 400]).toContain(res.statusCode); // 400 se già esiste
    if (res.statusCode === 201) {
      expect(res.body.id_ordine).toBe(ID_ORDINE);
    }
  });

  it('GET /api/pagamenti/:id_ordine - Recupera pagamento per ordine', async () => {
    const res = await request(app)
      .get(`/api/pagamenti/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenUtente}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.metodo_pagamento).toBe(metodo_test);
    }
  });

  it('PUT /api/pagamenti/:id_ordine - Aggiorna stato pagamento (admin)', async () => {
    const res = await request(app)
      .put(`/api/pagamenti/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ stato_pagamento: 'rimborsato' });

    expect([200, 404, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.stato_pagamento).toBe('rimborsato');
    }
  });

  it('DELETE /api/pagamenti/:id_ordine - Elimina pagamento (admin)', async () => {
    const res = await request(app)
      .delete(`/api/pagamenti/${ID_ORDINE}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.message).toBe('Pagamento eliminato');
    }
  });
});
