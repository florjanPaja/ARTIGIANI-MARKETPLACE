# 📦 API Ordini - Endpoints

---

## 🔐 AUTENTICAZIONE

> Tutti gli endpoint richiedono `Authorization: Bearer <token>`

---

### POST /api/ordini
- **Descrizione**: Crea un nuovo ordine per l’utente autenticato.
- **Autenticazione**: ✅ cliente
- **Body (JSON)**:
```json
{
  "righe": [
    {
      "id_articolo": "uuid",
      "prezzo_unitario": 19.99,
      "quantita": 2
    }
  ]
}
```
- **Risposta**:
```json
{
  "message": "Ordine creato",
  "ordineId": "uuid"
}
```

---

### GET /api/ordini/utente/:id_utente
- **Descrizione**: Recupera tutti gli ordini di un cliente.
- **Autenticazione**: ✅ cliente (sé stesso) o admin
- **Parametri**:
  - `:id_utente`: ID del cliente
- **Risposta**: `Array<Ordine>`

---

### GET /api/ordini/artigiano/:id_artigiano
- **Descrizione**: Recupera gli ordini contenenti articoli di un artigiano.
- **Autenticazione**: ✅ artigiano o admin
- **Parametri**:
  - `:id_artigiano`
- **Risposta**: `Array<Ordine>`

---

### GET /api/ordini/:id
- **Descrizione**: Ottiene il dettaglio completo di un ordine (testata + righe).
- **Autenticazione**: ✅ qualsiasi ruolo autorizzato
- **Parametri**:
  - `:id`: ID ordine
- **Risposta**:
```json
{
  "id": "uuid",
  "id_utente": "uuid",
  "stato": "pagato",
  "data_ordine": "2025-06-23T...",
  "righe": [
    {
      "id_articolo": "uuid",
      "quantita": 2,
      "prezzo_unitario": 19.99,
      "nome_articolo": "Prodotto A"
    }
  ]
}
```

---

### PUT /api/ordini/:id
- **Descrizione**: Aggiorna lo stato dell’ordine.
- **Autenticazione**: ✅ cliente o admin
- **Body (JSON)**:
```json
{ "stato": "in preparzione" }
```
- **Valori validi**: `pagato`, `in preparzione`, `spedito`, `annullato`
- **Risposta**:
```json
{
  "message": "Stato aggiornato",
  "ordine": { ... }
}
```

---

### DELETE /api/ordini/:id
- **Descrizione**: Elimina un ordine (solo admin).
- **Autenticazione**: ✅ solo admin
- **Parametri**:
  - `:id`: ID ordine
- **Risposta**:
```json
{
  "message": "Ordine eliminato"
}
```

---

## 📊 STATISTICHE

### GET /api/ordini/admin/all
- **Descrizione**: Elenco completo di tutti gli ordini (solo admin).
- **Autenticazione**: ✅ solo admin
- **Risposta**: `Array<Ordine>`

---

### GET /api/ordini/admin/stats/count-by-stato
- **Descrizione**: Conteggio ordini per stato.
- **Autenticazione**: ✅ solo admin
- **Risposta**:
```json
[
  { "stato": "pagato", "totale": "8" },
  { "stato": "spedito", "totale": "5" },
  ...
]
```

---

### GET /api/ordini/artigiano/:id_artigiano/stats/totale
- **Descrizione**: Totale incassato da un artigiano.
- **Autenticazione**: ✅ artigiano
- **Risposta**:
```json
{ "totale": 235.70 }
```

---

### GET /api/ordini/artigiano/:id_artigiano/stats/articoli
- **Descrizione**: Statistiche per articolo (vendite e incasso).
- **Autenticazione**: ✅ artigiano
- **Risposta**:
```json
[
  {
    "nome": "Portachiavi legno",
    "pezzi_venduti": "8",
    "incasso": "64.00"
  },
  ...
]
```

---

## 🧾 Schema ordine semplificato

```json
{
  "id": "uuid",
  "id_utente": "uuid",
  "data_ordine": "2025-06-23T...",
  "stato": "pagato",
  "righe": [
    {
      "id_articolo": "uuid",
      "quantita": 1,
      "prezzo_unitario": 19.99
    }
  ]
}
```
