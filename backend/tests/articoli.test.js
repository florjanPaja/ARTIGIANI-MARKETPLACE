const request = require('supertest');
const app = require('../app');

let token;
let articoloId;

beforeAll(async () => {
  // Login utente registrato (artigiano o admin)
  const login = await request(app).post('/api/auth/login').send({
    email: 'mario@test.com',
    password: '123456'
  });
  token = login.body.token;
});

describe('🛍️ API ARTICOLI', () => {
  // ✅ Crea articolo
  test('Crea articolo', async () => {
    const res = await request(app)
      .post('/api/articoli')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_artigiano: 1,
        nome: 'Portachiavi Test',
        descrizione: 'Oggetto artigianale',
        prezzo: 15.00,
        disponibilita: 10,
        categoria: 'Accessori',
        sconto_percentuale: 10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Portachiavi Test');
    articoloId = res.body.id;
  });

  // ✅ Elenco tutti gli articoli
  test('Recupera tutti gli articoli', async () => {
    const res = await request(app)
      .get('/api/articoli')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Recupera articolo per ID
  test('Recupera articolo per ID', async () => {
    const res = await request(app)
      .get(`/api/articoli/${articoloId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', articoloId);
  });

  // ✅ Ricerca articolo
  test('Ricerca articolo per nome', async () => {
    const res = await request(app)
      .get('/api/articoli/search?q=Portachiavi')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Aggiorna articolo
  test('Aggiorna articolo', async () => {
    const res = await request(app)
      .put(`/api/articoli/${articoloId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        prezzo: 12.50,
        disponibilita: 8
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.prezzo).toBe("12.50"); // valore restituito come stringa da PostgreSQL
    expect(res.body.disponibilita).toBe(8);
  });

  // ✅ Cancella articolo
  test('Elimina articolo', async () => {
    const res = await request(app)
      .delete(`/api/articoli/${articoloId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminato/i);
  });

  // ❌ Recupera articolo inesistente
  test('Articolo non trovato', async () => {
    const res = await request(app)
      .get(`/api/articoli/${articoloId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
