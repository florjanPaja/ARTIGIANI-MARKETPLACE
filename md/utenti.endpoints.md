# 👤 API Utenti & Autenticazione

---

## 🔐 AUTENTICAZIONE

### POST /api/auth/login
- **Descrizione**: Login con email e password.
- **Autenticazione**: ❌ Nessuna
- **Body (JSON)**:
```json
{
  "email": "utente@mail.com",
  "password": "123456"
}
```
- **Risposta**:
```json
{
  "token": "JWT_STRING",
  "utente": {
    "id": "uuid",
    "nome": "Mario",
    "email": "utente@mail.com",
    ...
  }
}
```

---

## 📝 REGISTRAZIONE & PROFILO PUBBLICO

### POST /api/utenti/register
- **Descrizione**: Crea un nuovo utente.
- **Autenticazione**: ❌ Nessuna
- **Body (JSON)**:
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "utente@mail.com",
  "password": "123456",
  "ruolo": "cliente" | "artigiano"
}
```
- **Risposta**: `Utente creato (senza password_hash)`

---

### GET /api/utenti/artigiani/:id/pubblico
- **Descrizione**: Ottiene il profilo pubblico di un artigiano.
- **Autenticazione**: ❌ Nessuna
- **Parametri**:
  - `:id`: ID dell’artigiano
- **Risposta**:
```json
{
  "id": "uuid",
  "nome_attivita": "Bottega Creativa",
  "bio": "Specializzato in ceramiche",
  "sito_web": "https://...",
  "citta": "Roma",
  "stato": "Italia"
}
```

---

## 🔐 ROTTE PROTETTE (Token richiesto)

> ⚠️ Richiede `Authorization: Bearer <token>`

---

### GET /api/utenti
- **Descrizione**: Elenco di tutti gli utenti.
- **Autenticazione**: ✅ Solo admin
- **Risposta**: `Array<Utente>`

---

### GET /api/utenti/:id
- **Descrizione**: Recupera il proprio profilo o quello di un altro utente (admin).
- **Autenticazione**: ✅ admin o sé stesso
- **Parametri**:
  - `:id`: ID dell’utente
- **Risposta**: `Utente`

---

### PUT /api/utenti/:id
- **Descrizione**: Aggiorna i dati dell’utente.
- **Autenticazione**: ✅ admin o sé stesso
- **Body (JSON)**:
```json
{
  "telefono": "+39333...",
  "indirizzo": "Via Roma 1",
  "citta": "Napoli"
}
```
- **Risposta**: `Utente aggiornato`

---

### DELETE /api/utenti/:id
- **Descrizione**: Elimina un utente.
- **Autenticazione**: ✅ admin o sé stesso
- **Risposta**:
```json
{
  "message": "Utente eliminato",
  "utente": { ... }
}
```

---

### GET /api/utenti/stats
- **Descrizione**: Statistiche per ruolo (solo admin).
- **Autenticazione**: ✅ solo admin
- **Risposta**:
```json
{
  "clienti": "24",
  "artigiani": "8",
  "admin": "1"
}
```

---

## 🧍 Schema base utente

```json
{
  "id": "uuid",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "utente@mail.com",
  "ruolo": "cliente" | "artigiano" | "admin",
  "telefono": null,
  "indirizzo": null,
  "citta": null,
  "cap": null,
  "stato": null,
  "nome_attivita": null,
  "partita_iva": null,
  "bio": null,
  "sito_web": null,
  "data_creazione": "2025-06-23T..."
}
```
