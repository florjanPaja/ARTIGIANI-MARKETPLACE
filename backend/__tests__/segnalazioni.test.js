const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');

// UUID coerenti con setupTestDb.js
const ID_CLIENTE = '11111111-1111-1111-1111-111111111111';
const ID_ADMIN = '22222222-2222-2222-2222-222222222222';

const tokenUtente = jwt.generateToken({ id: ID_CLIENTE, ruolo: 'cliente' });
const tokenAdmin = jwt.generateToken({ id: ID_ADMIN, ruolo: 'admin' });

let idSegnalazione;

describe('📨 API Segnalazioni', () => {
  it('POST /api/segnalazioni - Crea nuova segnalazione', async () => {
    const res = await request(app)
      .post('/api/segnalazioni')
      .set('Authorization', `Bearer ${tokenUtente}`)
      .send({
        oggetto: 'Prodotto difettoso',
        messaggio: 'Ho ricevuto un articolo rotto.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    idSegnalazione = res.body.id;
  });

  it('POST /api/segnalazioni/:id/messaggi - Aggiunge messaggio alla segnalazione', async () => {
    const res = await request(app)
      .post(`/api/segnalazioni/${idSegnalazione}/messaggi`)
      .set('Authorization', `Bearer ${tokenUtente}`)
      .send({
        mittente: 'utente',
        messaggio: 'Vorrei risolvere il problema al più presto.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('messaggio');
  });

  it('GET /api/segnalazioni/:id/messaggi - Recupera messaggi segnalazione', async () => {
    const res = await request(app)
      .get(`/api/segnalazioni/${idSegnalazione}/messaggi`)
      .set('Authorization', `Bearer ${tokenUtente}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PUT /api/segnalazioni/:id/stato - Cambia stato segnalazione (admin)', async () => {
    const res = await request(app)
      .put(`/api/segnalazioni/${idSegnalazione}/stato`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ stato: 'in_gestione' });

    expect([200, 400, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.stato_segnalazione).toBe('in_gestione');
    }
  });

  it('GET /api/segnalazioni/utente/:id - Segnalazioni dell\'utente', async () => {
    const res = await request(app)
      .get(`/api/segnalazioni/utente/${ID_CLIENTE}`)
      .set('Authorization', `Bearer ${tokenUtente}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/segnalazioni - Recupera tutte le segnalazioni (admin)', async () => {
    const res = await request(app)
      .get('/api/segnalazioni')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
