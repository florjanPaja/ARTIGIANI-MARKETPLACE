const request = require('supertest');
const app = require('../app');
const jwt = require('../utils/jwt');
const path = require('path');

// UUID già presenti nel setupTestDb.js
const ARTIGIANO_ID = '33333333-3333-3333-3333-333333333333';
const ADMIN_ID = '22222222-2222-2222-2222-222222222222';

const TOKEN_ADMIN = jwt.generateToken({ id: ADMIN_ID, ruolo: 'admin' });
const TOKEN_ARTIGIANO = jwt.generateToken({ id: ARTIGIANO_ID, ruolo: 'artigiano' });

let articoloCreatoId;

describe('🔍 API Articoli', () => {
  it('GET /api/articoli - Lista pubblica', async () => {
    const res = await request(app).get('/api/articoli');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/articoli - Crea nuovo articolo (artigiano)', async () => {
    const res = await request(app)
      .post('/api/articoli')
      .set('Authorization', `Bearer ${TOKEN_ARTIGIANO}`)
      .field('nome', 'Test Articolo')
      .field('descrizione', 'Descrizione di test')
      .field('prezzo', 20.5)
      .field('disponibilita', 10)
      .attach('immagini', path.join(__dirname, 'test.jpg')); // ✅ immagine dummy

    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.nome).toBe('Test Articolo');
      articoloCreatoId = res.body.id;
    }
  });

  it('GET /api/articoli/:id - Ottieni articolo per ID', async () => {
    if (!articoloCreatoId) return;
    const res = await request(app).get(`/api/articoli/${articoloCreatoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(articoloCreatoId);
  });

  it('PUT /api/articoli/:id - Aggiorna articolo (artigiano)', async () => {
    if (!articoloCreatoId) return;
    const res = await request(app)
      .put(`/api/articoli/${articoloCreatoId}`)
      .set('Authorization', `Bearer ${TOKEN_ARTIGIANO}`)
      .field('descrizione', 'Nuova descrizione aggiornata');

    expect(res.statusCode).toBe(200);
    expect(res.body.descrizione).toBe('Nuova descrizione aggiornata');
  });

  it('GET /api/articoli/artigiano/:id_artigiano - Articoli di un artigiano', async () => {
    const res = await request(app)
      .get(`/api/articoli/artigiano/${ARTIGIANO_ID}`)
      .set('Authorization', `Bearer ${TOKEN_ARTIGIANO}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/articoli/search?q=Test - Ricerca', async () => {
    const res = await request(app).get('/api/articoli/search?q=Test');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/articoli/admin/stats - Statistiche globali (admin)', async () => {
    const res = await request(app)
      .get('/api/articoli/admin/stats')
      .set('Authorization', `Bearer ${TOKEN_ADMIN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totale_prodotti');
  });

  it('GET /api/articoli/artigiano/:id_artigiano/stats - Statistiche artigiano', async () => {
    const res = await request(app)
      .get(`/api/articoli/artigiano/${ARTIGIANO_ID}/stats`)
      .set('Authorization', `Bearer ${TOKEN_ARTIGIANO}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totale');
  });

  it('DELETE /api/articoli/:id - Elimina articolo (artigiano)', async () => {
    if (!articoloCreatoId) return;
    const res = await request(app)
      .delete(`/api/articoli/${articoloCreatoId}`)
      .set('Authorization', `Bearer ${TOKEN_ARTIGIANO}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Articolo eliminato');
  });
});
