# 🛒 API Carrello - Endpoints

---

## 🔐 AUTENTICAZIONE

> Tutti gli endpoint richiedono `Authorization: Bearer <token>`

---

### GET /api/carrello/:id_utente
- **Descrizione**: Ottiene tutti gli articoli nel carrello dell’utente.
- **Autenticazione**: ✅ utente loggato (sé stesso) o admin
- **Parametri**:
  - `:id_utente` – ID dell’utente
- **Risposta**:
```json
[
  {
    "id_articolo": "uuid",
    "quantita": 2,
    "prezzo_unitario": 19.99,
    "nome": "Vaso in ceramica",
    "disponibilita": 12,
    "prezzo_originale": 19.99
  },
  ...
]
```

---

### POST /api/carrello
- **Descrizione**: Aggiunge o aggiorna un articolo nel carrello.
- **Autenticazione**: ✅ richiesta
- **Body (JSON)**:
```json
{
  "id_utente": "uuid",
  "id_articolo": "uuid",
  "prezzo_unitario": 10.5,
  "quantita": 2
}
```
- **Comportamento**:
  - Se `quantita > 0` ➜ aggiunge o aggiorna
  - Se `quantita = 0` ➜ rimuove
- **Risposta**:
```json
{
  "id_articolo": "uuid",
  "quantita": 2,
  "prezzo_unitario": 10.5
}
```

---

### POST /api/carrello/rimuovi
- **Descrizione**: Rimuove un singolo articolo dal carrello.
- **Autenticazione**: ✅ richiesta
- **Body (JSON)**:
```json
{
  "id_utente": "uuid",
  "id_articolo": "uuid"
}
```
- **Risposta**:
```json
{
  "message": "Articolo rimosso dal carrello",
  "eliminato": {
    "id_articolo": "uuid",
    ...
  }
}
```

---

### POST /api/carrello/svuota
- **Descrizione**: Svuota completamente il carrello dell’utente.
- **Autenticazione**: ✅ richiesta
- **Body (JSON)**:
```json
{
  "id_utente": "uuid"
}
```
- **Risposta**:
```json
{
  "message": "Carrello svuotato con successo"
}
```

---

## 📝 Note
- La testata del carrello viene creata automaticamente se non esiste.
- Il campo `disponibilita` viene verificato prima di inserire/aggiornare una riga.
- Le righe carrello sono salvate nella tabella `riga_carrello` e collegate alla `testata_carrello`.
