const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID admin coerente con setupTestDb.js
const ID_ADMIN = '22222222-2222-2222-2222-222222222222';
const adminToken = jwt.generateToken({ id: ID_ADMIN, ruolo: 'admin' });

let tokenCliente = null;
let userId = null;

describe('🧪 API Auth & Utenti', () => {
  const emailTest = `utente${Date.now()}@mail.com`;

  it('POST /api/utenti/register - Registrazione utente', async () => {
    const res = await request(app)
      .post('/api/utenti/register')
      .send({
        nome: 'Mario',
        cognome: 'Rossi',
        email: emailTest,
        password: '123456',
        ruolo: 'cliente'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(emailTest);
    userId = res.body.id;
  });

  it('POST /api/auth/login - Login utente registrato', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: emailTest, password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    tokenCliente = res.body.token;
  });

  it('GET /api/utenti/:id - Ottieni il proprio profilo', async () => {
    const res = await request(app)
      .get(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('PUT /api/utenti/:id - Aggiorna dati utente', async () => {
    const res = await request(app)
      .put(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ citta: 'Roma' });

    expect(res.statusCode).toBe(200);
    expect(res.body.citta).toBe('Roma');
  });

  it('GET /api/utenti/artigiani/:id/pubblico - Profilo pubblico artigiano', async () => {
    const res = await request(app).get(`/api/utenti/artigiani/${userId}/pubblico`);
    expect([200, 404]).toContain(res.statusCode); // può non essere artigiano
  });

  it('GET /api/utenti - Lista utenti (admin)', async () => {
    const res = await request(app)
      .get('/api/utenti')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/utenti/stats - Statistiche utenti (admin)', async () => {
    const res = await request(app)
      .get('/api/utenti/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('clienti');
  });

  it('DELETE /api/utenti/:id - Elimina utente registrato', async () => {
    const res = await request(app)
      .delete(`/api/utenti/${userId}`)
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Utente eliminato');
  });
});
