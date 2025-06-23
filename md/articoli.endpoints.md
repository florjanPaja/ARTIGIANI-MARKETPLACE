# 📦 API Articoli - Endpoints

## 🔓 PUBBLICI

### GET /api/articoli
- **Descrizione**: Ottiene tutti gli articoli disponibili.
- **Autenticazione**: ❌ Nessuna
- **Query**: Nessuna
- **Risposta**: `Array<Articolo>`

---

### GET /api/articoli/:id
- **Descrizione**: Ottiene i dettagli di un articolo specifico.
- **Autenticazione**: ❌ Nessuna
- **Parametri**:
  - `:id` → ID dell’articolo
- **Risposta**: `Articolo`

---

### GET /api/articoli/search?q=termine
- **Descrizione**: Ricerca articoli tramite nome, descrizione o categoria.
- **Autenticazione**: ❌ Nessuna
- **Query**:
  - `q`: stringa di ricerca
- **Risposta**: `Array<Articolo>`

---

## 🔐 AUTENTICATI

> ⚠️ Richiede Header: `Authorization: Bearer <token>`

---

### GET /api/articoli/artigiano/:id_artigiano
- **Descrizione**: Articoli appartenenti a uno specifico artigiano.
- **Autenticazione**: ✅ artigiano o admin
- **Parametri**:
  - `:id_artigiano`
- **Risposta**: `Array<Articolo>`

---

### POST /api/articoli
- **Descrizione**: Crea un nuovo articolo.
- **Autenticazione**: ✅ artigiano o admin
- **Body (form-data multipart)**:
  - `nome`: string ✅
  - `descrizione`: string (facoltativo)
  - `prezzo`: float ✅
  - `disponibilita`: int ✅
  - `categoria`: string (facoltativo)
  - `sconto_percentuale`: float (facoltativo)
  - `in_sconto`: boolean (facoltativo)
  - `data_inizio_sconto`: YYYY-MM-DD (facoltativo)
  - `data_fine_sconto`: YYYY-MM-DD (facoltativo)
  - `immagini`: file[] (max 5 immagini jpg/png/webp)
- **Risposta**: `Articolo creato`

---

### PUT /api/articoli/:id
- **Descrizione**: Aggiorna un articolo esistente.
- **Autenticazione**: ✅ admin o artigiano proprietario
- **Parametri**:
  - `:id`: ID dell’articolo da modificare
- **Body (form-data multipart)**:
  - Qualsiasi campo aggiornabile (`nome`, `prezzo`, ecc.)
  - `immaginiEsistenti`: `["/img/img1.jpg", "/img/img2.jpg"]` (JSON string)
  - `immaginiDaRimuovere`: `["/img/da_rimuovere.jpg"]` (JSON string)
  - `immagini`: file[] (nuove immagini da caricare)
- **Risposta**: `Articolo aggiornato`

---

### DELETE /api/articoli/:id
- **Descrizione**: Elimina un articolo.
- **Autenticazione**: ✅ admin o artigiano proprietario
- **Parametri**:
  - `:id`: ID dell’articolo da eliminare
- **Risposta**: `{ message, rimosso }`

---

### GET /api/articoli/admin/stats
- **Descrizione**: Statistiche globali degli articoli (admin).
- **Autenticazione**: ✅ solo admin
- **Risposta**:
  ```json
  {
    "totale_prodotti": "12",
    "esauriti": "2",
    "in_sconto": "5"
  }
