# Documentazione CRUD - Database Artigianato Online

Questo documento descrive le operazioni **Create**, **Read**, **Update** e **Delete** (CRUD) per ciascuna tabella del database.

---

## utenti
**Descrizione:** Contiene informazioni sugli utenti: clienti, artigiani e amministratori.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO utenti (nome, cognome, email, password_hash, ruolo, telefono, indirizzo, citta, cap, stato)
VALUES (%(nome)s, %(cognome)s, %(email)s, %(password_hash)s, %(ruolo)s, %(telefono)s, %(indirizzo)s, %(citta)s, %(cap)s, %(stato)s);
```

### READ
```sql
SELECT * FROM utenti WHERE id = ?;
```

### UPDATE
```sql
UPDATE utenti
SET nome = %(nome)s, cognome = %(cognome)s, email = %(email)s, password_hash = %(password_hash)s, ruolo = %(ruolo)s, telefono = %(telefono)s, indirizzo = %(indirizzo)s, citta = %(citta)s, cap = %(cap)s, stato = %(stato)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM utenti WHERE id = ?;
```

---

## articoli
**Descrizione:** Articoli venduti dagli artigiani.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO articoli (id_artigiano, nome, descrizione, prezzo, disponibilita, categoria)
VALUES (%(id_artigiano)s, %(nome)s, %(descrizione)s, %(prezzo)s, %(disponibilita)s, %(categoria)s);
```

### READ
```sql
SELECT * FROM articoli WHERE id = ?;
```

### UPDATE
```sql
UPDATE articoli
SET id_artigiano = %(id_artigiano)s, nome = %(nome)s, descrizione = %(descrizione)s, prezzo = %(prezzo)s, disponibilita = %(disponibilita)s, categoria = %(categoria)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM articoli WHERE id = ?;
```

---

## testata_ordine
**Descrizione:** Testata dell'ordine effettuato dal cliente.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO testata_ordine (id_utente, data_ordine, stato)
VALUES (%(id_utente)s, %(data_ordine)s, %(stato)s);
```

### READ
```sql
SELECT * FROM testata_ordine WHERE id = ?;
```

### UPDATE
```sql
UPDATE testata_ordine
SET id_utente = %(id_utente)s, data_ordine = %(data_ordine)s, stato = %(stato)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM testata_ordine WHERE id = ?;
```

---

## riga_ordine
**Descrizione:** Singole righe di ogni ordine con dettaglio articoli acquistati.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO riga_ordine (id_testata, id_articolo, prezzo_unitario, quantita)
VALUES (%(id_testata)s, %(id_articolo)s, %(prezzo_unitario)s, %(quantita)s);
```

### READ
```sql
SELECT * FROM riga_ordine WHERE id = ?;
```

### UPDATE
```sql
UPDATE riga_ordine
SET id_testata = %(id_testata)s, id_articolo = %(id_articolo)s, prezzo_unitario = %(prezzo_unitario)s, quantita = %(quantita)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM riga_ordine WHERE id = ?;
```

---

## pagamenti
**Descrizione:** Informazioni sui pagamenti effettuati.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO pagamenti (id_ordine, importo, metodo_pagamento, stato_pagamento)
VALUES (%(id_ordine)s, %(importo)s, %(metodo_pagamento)s, %(stato_pagamento)s);
```

### READ
```sql
SELECT * FROM pagamenti WHERE id = ?;
```

### UPDATE
```sql
UPDATE pagamenti
SET id_ordine = %(id_ordine)s, importo = %(importo)s, metodo_pagamento = %(metodo_pagamento)s, stato_pagamento = %(stato_pagamento)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM pagamenti WHERE id = ?;
```

---

## spedizioni
**Descrizione:** Dettagli della spedizione associata a ciascun ordine.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO spedizioni (id_ordine, id_utente, indirizzo_spedizione, citta, cap, stato, tracking_code)
VALUES (%(id_ordine)s, %(id_utente)s, %(indirizzo_spedizione)s, %(citta)s, %(cap)s, %(stato)s, %(tracking_code)s);
```

### READ
```sql
SELECT * FROM spedizioni WHERE id = ?;
```

### UPDATE
```sql
UPDATE spedizioni
SET id_ordine = %(id_ordine)s, id_utente = %(id_utente)s, indirizzo_spedizione = %(indirizzo_spedizione)s, citta = %(citta)s, cap = %(cap)s, stato = %(stato)s, tracking_code = %(tracking_code)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM spedizioni WHERE id = ?;
```

---

## testata_carrello
**Descrizione:** Rappresenta il carrello di un utente.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO testata_carrello (id_utente)
VALUES (%(id_utente)s);
```

### READ
```sql
SELECT * FROM testata_carrello WHERE id = ?;
```

### UPDATE
```sql
UPDATE testata_carrello
SET id_utente = %(id_utente)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM testata_carrello WHERE id = ?;
```

---

## riga_carrello
**Descrizione:** Righe del carrello con articoli e quantità selezionate.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO riga_carrello (id_testata, id_articolo, prezzo_unitario, quantita)
VALUES (%(id_testata)s, %(id_articolo)s, %(prezzo_unitario)s, %(quantita)s);
```

### READ
```sql
SELECT * FROM riga_carrello WHERE id = ?;
```

### UPDATE
```sql
UPDATE riga_carrello
SET id_testata = %(id_testata)s, id_articolo = %(id_articolo)s, prezzo_unitario = %(prezzo_unitario)s, quantita = %(quantita)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM riga_carrello WHERE id = ?;
```

---

## segnalazioni
**Descrizione:** Segnalazioni effettuate dagli utenti verso l’amministrazione.

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO segnalazioni (id_utente, oggetto, stato_segnalazione)
VALUES (%(id_utente)s, %(oggetto)s, %(stato_segnalazione)s);
```

### READ
```sql
SELECT * FROM segnalazioni WHERE id = ?;
```

### UPDATE
```sql
UPDATE segnalazioni
SET id_utente = %(id_utente)s, oggetto = %(oggetto)s, stato_segnalazione = %(stato_segnalazione)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM segnalazioni WHERE id = ?;
```

---

## segnalazione_messaggi
**Descrizione:** Messaggi all’interno di una segnalazione (chat utente/admin).

**Chiave primaria:** `id`

### CREATE
```sql
INSERT INTO segnalazione_messaggi (id_segnalazione, mittente, messaggio)
VALUES (%(id_segnalazione)s, %(mittente)s, %(messaggio)s);
```

### READ
```sql
SELECT * FROM segnalazione_messaggi WHERE id = ?;
```

### UPDATE
```sql
UPDATE segnalazione_messaggi
SET id_segnalazione = %(id_segnalazione)s, mittente = %(mittente)s, messaggio = %(messaggio)s
WHERE id = ?;
```

### DELETE
```sql
DELETE FROM segnalazione_messaggi WHERE id = ?;
```

---

