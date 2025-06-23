# 📦 API Spedizioni - Endpoints

---

## 🔐 AUTENTICAZIONE

> Tutti gli endpoint richiedono `Authorization: Bearer <token>`

---

### POST /api/spedizioni
- **Descrizione**: Crea una nuova spedizione per un ordine.
- **Autenticazione**: ✅ utente loggato
- **Body (JSON)**:
```json
{
  "id_ordine": "uuid",
  "id_utente": "uuid",
  "indirizzo_spedizione": "Via Roma 1",
  "citta": "Milano",
  "cap": "20100",
  "stato": "Italia",
  "tracking_code": "TRK123456789"
}
```
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "indirizzo_spedizione": "Via Roma 1",
  "stato": "Italia",
  "tracking_code": "TRK123456789",
  ...
}
```

---

### GET /api/spedizioni/:id_ordine
- **Descrizione**: Recupera i dati di spedizione per un ordine.
- **Autenticazione**: ✅ utente loggato
- **Parametri**:
  - `:id_ordine`: ID dell’ordine
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "indirizzo_spedizione": "Via Roma 1",
  "citta": "Milano",
  "cap": "20100",
  "stato": "Italia",
  "tracking_code": "TRK123456789",
  "stato_spedizione": "in_preparazione"
}
```

---

### PUT /api/spedizioni/:id_ordine
- **Descrizione**: Aggiorna lo stato della spedizione (es. spedito, consegnato).
- **Autenticazione**: ✅ solo admin
- **Body (JSON)**:
```json
{
  "stato_spedizione": "consegnato"
}
```
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "stato_spedizione": "consegnato"
}
```

---

### DELETE /api/spedizioni/:id_ordine
- **Descrizione**: Elimina una spedizione associata a un ordine.
- **Autenticazione**: ✅ solo admin
- **Parametri**:
  - `:id_ordine`
- **Risposta**:
```json
{
  "message": "Spedizione eliminata",
  "spedizione": { ... }
}
```

---

## 📦 Schema Spedizione

```json
{
  "id_ordine": "uuid",
  "id_utente": "uuid",
  "indirizzo_spedizione": "Via Roma 1",
  "citta": "Milano",
  "cap": "20100",
  "stato": "Italia",
  "tracking_code": "TRK123456789",
  "stato_spedizione": "spedito"
}
```
