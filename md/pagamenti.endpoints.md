# 💳 API Pagamenti - Endpoints

---

## 🔐 AUTENTICAZIONE

> Tutti gli endpoint richiedono `Authorization: Bearer <token>`

---

### POST /api/pagamenti
- **Descrizione**: Registra un pagamento per un ordine.
- **Autenticazione**: ✅ utente
- **Body (JSON)**:
```json
{
  "id_ordine": "uuid",
  "importo": 49.99,
  "metodo_pagamento": "carta"
}
```
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "importo": 49.99,
  "metodo_pagamento": "carta",
  "stato_pagamento": "completato"
}
```

---

### GET /api/pagamenti/:id_ordine
- **Descrizione**: Recupera il pagamento associato a un ordine.
- **Autenticazione**: ✅ utente (qualsiasi ruolo)
- **Parametri**:
  - `:id_ordine`: ID dell’ordine
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "importo": 49.99,
  "metodo_pagamento": "carta",
  "stato_pagamento": "completato"
}
```

---

### PUT /api/pagamenti/:id_ordine
- **Descrizione**: Aggiorna lo stato di un pagamento (solo admin).
- **Autenticazione**: ✅ solo admin
- **Body (JSON)**:
```json
{
  "stato_pagamento": "rimborsato"
}
```
- **Risposta**:
```json
{
  "id_ordine": "uuid",
  "stato_pagamento": "rimborsato"
}
```

---

### DELETE /api/pagamenti/:id_ordine
- **Descrizione**: Elimina un pagamento (solo admin).
- **Autenticazione**: ✅ solo admin
- **Parametri**:
  - `:id_ordine`: ID dell’ordine
- **Risposta**:
```json
{
  "message": "Pagamento eliminato",
  "pagamento": {
    "id_ordine": "uuid",
    "importo": 49.99,
    ...
  }
}
```

---

## 💡 Note

- I pagamenti sono univoci per ordine: 1 ordine = 1 pagamento.
- Lo stato iniziale è `"completato"` (simulazione).
- Stato modificabile in: `completato`, `in_attesa`, `rimborsato`, ecc.

## 📦 Schema pagamento

```json
{
  "id_ordine": "uuid",
  "importo": 49.99,
  "metodo_pagamento": "carta",
  "stato_pagamento": "completato"
}
```
