const request = require('supertest');
const app = require('../app');

let token;
let articoloId;
let userId = 1; // Assicurati che corrisponda a quello reale

beforeAll(async () => {
  // Login utente esistente
  const login = await request(app).post('/api/auth/login').send({
    email: 'mario@test.com',
    password: '123456'
  });
  token = login.body.token;

  // Crea un articolo da usare nei test
  const articolo = await request(app)
    .post('/api/articoli')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_artigiano: userId,
      nome: 'Articolo Carrello',
      descrizione: 'Test articolo carrello',
      prezzo: 20,
      disponibilita: 100,
      categoria: 'Test',
      sconto_percentuale: 0
    });
  articoloId = articolo.body.id;
});

describe('🧺 API CARRELLO', () => {
  // ✅ Aggiungi articolo al carrello
  test('Aggiungi nuovo articolo al carrello', async () => {
    const res = await request(app)
      .post('/api/carrello')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_utente: userId,
        id_articolo: articoloId,
        prezzo_unitario: 20,
        quantita: 2
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quantita).toBe(2);
  });

  // ✅ Aggiungi lo stesso articolo → incrementa quantità
  test('Aggiungi ancora stesso articolo → incrementa quantità', async () => {
    const res = await request(app)
      .post('/api/carrello')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_utente: userId,
        id_articolo: articoloId,
        prezzo_unitario: 20,
        quantita: 3
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quantita).toBe(5); // 2 + 3
  });

  // ✅ Visualizza carrello
  test('Visualizza contenuto del carrello', async () => {
    const res = await request(app)
      .get(`/api/carrello/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Rimuovi articolo
  test('Rimuovi articolo dal carrello', async () => {
    const res = await request(app)
      .post('/api/carrello/rimuovi')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_utente: userId,
        id_articolo: articoloId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/rimosso/i);
  });

  // ❌ Verifica che il carrello sia ora vuoto
  test('Verifica carrello vuoto dopo rimozione', async () => {
    const res = await request(app)
      .get(`/api/carrello/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
