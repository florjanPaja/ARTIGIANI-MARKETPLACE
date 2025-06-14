const request = require('supertest');
const app = require('../app');

let token;
let userId = 1;
let ordineId;
let articoloId;

beforeAll(async () => {
  // Login
  const login = await request(app).post('/api/auth/login').send({
    email: 'mario@test.com',
    password: '123456'
  });
  token = login.body.token;

  // Crea articolo da ordinare
  const res = await request(app)
    .post('/api/articoli')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_artigiano: userId,
      nome: 'Articolo Ordine',
      descrizione: 'Descrizione ordine',
      prezzo: 25,
      disponibilita: 50,
      categoria: 'Ordini',
      sconto_percentuale: 0
    });

  articoloId = res.body.id;
});

describe('📦 API ORDINI', () => {
  // ✅ Crea ordine
  test('Crea ordine con una riga', async () => {
    const res = await request(app)
      .post('/api/ordini')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_utente: userId,
        righe: [{
          id_articolo: articoloId,
          prezzo_unitario: 25,
          quantita: 2
        }]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.ordine).toHaveProperty('id');
    ordineId = res.body.ordine.id;
  });

  // ✅ Lista ordini dell'utente
  test('Recupera tutti gli ordini dell\'utente', async () => {
    const res = await request(app)
      .get(`/api/ordini/utente/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Recupera ordine completo
  test('Recupera dettaglio ordine completo', async () => {
    const res = await request(app)
      .get(`/api/ordini/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('testata');
    expect(res.body).toHaveProperty('righe');
  });

  // ✅ Aggiorna stato ordine
  test('Aggiorna stato ordine a "spedito"', async () => {
    const res = await request(app)
      .put(`/api/ordini/${ordineId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stato: 'spedito' });

    expect(res.statusCode).toBe(200);
    expect(res.body.stato).toBe('spedito');
  });

  // ✅ Elimina ordine
  test('Elimina ordine', async () => {
    const res = await request(app)
      .delete(`/api/ordini/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminato/i);
  });

  // ❌ Ordine non esistente
  test('Recupera ordine eliminato → 404', async () => {
    const res = await request(app)
      .get(`/api/ordini/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
