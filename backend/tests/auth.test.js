const request = require('supertest');
const app = require('../app');

let token;

describe('🔐 AUTENTICAZIONE', () => {
  const testEmail = 'mario@test.com';
  const testPassword = '123456';

  // ✅ Registrazione corretta
  test('Registra nuovo utente', async () => {
    const res = await request(app).post('/api/utenti/register').send({
      nome: 'Mario',
      cognome: 'Rossi',
      email: testEmail,
      password: testPassword,
      ruolo: 'cliente'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', testEmail);
  });

  // ❌ Email già registrata
  test('Registrazione con email già esistente', async () => {
    const res = await request(app).post('/api/utenti/register').send({
      nome: 'Mario',
      cognome: 'Rossi',
      email: testEmail,
      password: testPassword,
      ruolo: 'cliente'
    });

    expect(res.statusCode).toBe(500); // oppure 409 se hai gestito il conflitto
  });

  // ✅ Login corretto
  test('Login con credenziali valide', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  // ❌ Password errata
  test('Login con password sbagliata', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'sbagliata'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/credenziali/i);
  });

  // ❌ Email inesistente
  test('Login con utente inesistente', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'non-esiste@test.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/non trovato/i);
  });
});
