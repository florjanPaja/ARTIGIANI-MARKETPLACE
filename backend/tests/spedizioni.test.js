const request = require('supertest');
const app = require('../app');

let token;
let userId = 1;
let ordineId;

beforeAll(async () => {
  // Login utente
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
      nome: 'Articolo Spedizione',
      descrizione: 'Per test spedizione',
      prezzo: 30,
      disponibilita: 5,
      categoria: 'Logistica',
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
        prezzo_unitario: 30,
        quantita: 1
      }]
    });

  ordineId = ordine.body.ordine.id;
});

describe('🚚 API SPEDIZIONI', () => {
  // ✅ Crea spedizione
  test('Crea spedizione per ordine', async () => {
    const res = await request(app)
      .post('/api/spedizioni')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_ordine: ordineId,
        id_utente: userId,
        indirizzo_spedizione: 'Via Spedizione 12',
        citta: 'Torino',
        cap: '10100',
        stato: 'Italia',
        tracking_code: 'TRACK123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.stato_spedizione).toBe('in_preparazione');
  });

  // ✅ Recupera spedizione per ordine
  test('Recupera spedizione', async () => {
    const res = await request(app)
      .get(`/api/spedizioni/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.tracking_code).toBe('TRACK123');
  });

  // ✅ Aggiorna stato spedizione
  test('Aggiorna stato a "spedito"', async () => {
    const res = await request(app)
      .put(`/api/spedizioni/${ordineId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stato_spedizione: 'spedito' });

    expect(res.statusCode).toBe(200);
    expect(res.body.stato_spedizione).toBe('spedito');
  });

  // ✅ Elimina spedizione
  test('Elimina spedizione', async () => {
    const res = await request(app)
      .delete(`/api/spedizioni/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminata/i);
  });

  // ❌ Verifica che non esista più
  test('Recupera spedizione dopo eliminazione → 404', async () => {
    const res = await request(app)
      .get(`/api/spedizioni/${ordineId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
