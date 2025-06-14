const request = require('supertest');
const app = require('../app');

let token;
let userId = 1;
let ordineId;
let pagamento;

beforeAll(async () => {
  // Login
  const login = await request(app).post('/api/auth/login').send({
    email: 'mario@test.com',
    password: '123456'
  });
  token = login.body.token;

  // Crea articolo
  const articolo = await request(app)
    .post('/api/articoli')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_artigiano: userId,
      nome: 'Articolo Pagamento',
      descrizione: 'Pagamento test',
      prezzo: 50,
      disponibilita: 10,
      categoria: 'Pagamenti',
      sconto_percentuale: 0
    });

  // Crea ordine
  const ordine = await request(app)
    .post('/api/ordini')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_utente: userId,
      righe: [{
        id_articolo: articolo.body.id,
        prezzo_unitario: 50,
        quantita: 1
      }]
    });

  ordineId = ordine.body.ordine.id;
});

describe('💳 API PAGAMENTI', () => {
  // ✅ Crea pagamento
  test('Crea pagamento per ordine', async () => {
    const res = await request(app)
      .post('/api/pagamenti')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_ordine: ordineId,
        importo: 50,
        metodo_pagamento: 'carta'
      });

    expect(res.statusCode).toBe(201);
    pagamento = res.body;
    expect(pagamento).toHaveProperty('id');
    expect(pagamento.stato_pagamento).toBe('in_attesa');
  });

  // ✅ Recupera pagamento per ordine
  test('Recupera pagamento', async () => {
    const res = await request(app)
      .get(`/api/pagamenti/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.importo).toBe("50.00");
  });

  // ✅ Aggiorna stato pagamento
  test('Aggiorna stato pagamento a completato', async () => {
    const res = await request(app)
      .put(`/api/pagamenti/${ordineId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stato_pagamento: 'completato' });

    expect(res.statusCode).toBe(200);
    expect(res.body.stato_pagamento).toBe('completato');
  });

  // ✅ Elimina pagamento
  test('Elimina pagamento', async () => {
    const res = await request(app)
      .delete(`/api/pagamenti/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminato/i);
  });

  // ❌ Pagamento non trovato dopo eliminazione
  test('Recupera pagamento dopo eliminazione → 404', async () => {
    const res = await request(app)
      .get(`/api/pagamenti/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
