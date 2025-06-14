const request = require('supertest');
const app = require('../app');

let token;
let userId;

beforeAll(async () => {
  // Registra nuovo utente
  await request(app).post('/api/utenti/register').send({
    nome: 'Test',
    cognome: 'User',
    email: 'testuser@demo.com',
    password: '123456',
    ruolo: 'cliente'
  });

  // Login per ottenere token e ID
  const login = await request(app).post('/api/auth/login').send({
    email: 'testuser@demo.com',
    password: '123456'
  });

  token = login.body.token;

  // Recupera ID dell'utente loggato tramite token
  const profile = await request(app)
    .get('/api/utenti/1') // Assumendo ID = 1 (modifica se necessario)
    .set('Authorization', `Bearer ${token}`);

  userId = profile.body.id;
});

describe('👤 API UTENTI', () => {
  // ✅ Recupera utente per ID
  test('Recupera utente per ID', async () => {
    const res = await request(app)
      .get(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('email', 'testuser@demo.com');
  });

  // ✅ Modifica profilo utente
  test('Aggiorna utente', async () => {
    const res = await request(app)
      .put(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ citta: 'Milano' });

    expect(res.statusCode).toBe(200);
    expect(res.body.citta).toBe('Milano');
  });

  // ✅ Elimina utente
  test('Elimina utente', async () => {
    const res = await request(app)
      .delete(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminato/i);
  });

  // ❌ Verifica utente non esiste più
  test('Recupera utente eliminato → 404', async () => {
    const res = await request(app)
      .get(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
