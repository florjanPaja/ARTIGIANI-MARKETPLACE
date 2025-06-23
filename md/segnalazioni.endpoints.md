# 📨 API Segnalazioni - Endpoints

---

## 🔐 AUTENTICAZIONE

> Tutti gli endpoint richiedono `Authorization: Bearer <token>`

---

### POST /api/segnalazioni
- **Descrizione**: Crea una nuova segnalazione con messaggio iniziale.
- **Autenticazione**: ✅ utente loggato
- **Body (JSON)**:
```json
{
  "oggetto": "Richiesta assistenza",
  "messaggio": "Descrizione del problema"
}
```
- **Risposta**:
```json
{
  "id": "uuid",
  "id_utente": "uuid",
  "oggetto": "Richiesta assistenza",
  "stato_segnalazione": "aperta",
  "data_creazione": "2025-06-23T..."
}
```

---

### POST /api/segnalazioni/:id/messaggi
- **Descrizione**: Aggiunge un messaggio a una segnalazione esistente.
- **Autenticazione**: ✅ utente loggato
- **Parametri**:
  - `:id`: ID segnalazione
- **Body (JSON)**:
```json
{
  "mittente": "utente" | "admin",
  "messaggio": "Risposta o commento"
}
```
- **Risposta**:
```json
{
  "mittente": "utente",
  "messaggio": "Risposta o commento",
  "data_invio": "2025-06-23T..."
}
```

---

### GET /api/segnalazioni/:id/messaggi
- **Descrizione**: Recupera tutti i messaggi di una segnalazione.
- **Autenticazione**: ✅ utente loggato
- **Parametri**:
  - `:id`: ID segnalazione
- **Risposta**: `Array<Messaggio>`
```json
[
  {
    "mittente": "utente",
    "messaggio": "Descrizione del problema",
    "data_invio": "2025-06-23T..."
  },
  {
    "mittente": "admin",
    "messaggio": "Stiamo verificando.",
    "data_invio": "2025-06-23T..."
  }
]
```

---

### PUT /api/segnalazioni/:id/stato
- **Descrizione**: Modifica lo stato di una segnalazione (solo admin).
- **Autenticazione**: ✅ solo admin
- **Body (JSON)**:
```json
{
  "stato": "aperta" | "in_gestione" | "attesa_risposta_utente" | "risolta"
}
```
- **Risposta**: `Segnalazione aggiornata`

---

### GET /api/segnalazioni/utente/:id
- **Descrizione**: Ottiene tutte le segnalazioni di un utente.
- **Autenticazione**: ✅ utente stesso o admin
- **Parametri**:
  - `:id`: ID dell’utente
- **Risposta**: `Array<Segnalazione>`

---

### GET /api/segnalazioni
- **Descrizione**: Recupera tutte le segnalazioni (admin dashboard).
- **Autenticazione**: ✅ solo admin
- **Risposta**: `Array<Segnalazione>`

---

## 📝 Schema segnalazione

```json
{
  "id": "uuid",
  "id_utente": "uuid",
  "oggetto": "Problema ordine #123",
  "stato_segnalazione": "in_gestione",
  "data_creazione": "2025-06-23T..."
}
```

## 🗨️ Schema messaggio

```json
{
  "mittente": "utente",
  "messaggio": "Ho un problema con l’ordine.",
  "data_invio": "2025-06-23T..."
}
```
