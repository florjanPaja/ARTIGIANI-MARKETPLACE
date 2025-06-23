# Guida Migrazione e Gestione Database PostgreSQL con PGAdmin

Questa guida spiega come **migrare**, **gestire** e **eseguire backup/restore** del database `Artigianato Online` su un'istanza PostgreSQL in cloud utilizzando **PGAdmin**.

---

## 📦 Requisiti

- PGAdmin installato ([https://www.pgadmin.org](https://www.pgadmin.org))
- Un database PostgreSQL in cloud (es: Render, Supabase, Heroku, ecc.)
- File `init.sql` contenente la struttura del database

---

## ✅ Connessione a PostgreSQL Cloud

1. **Apri PGAdmin**
2. Fai clic destro su “Servers” → `Create > Server...`
3. **Tab General**:
   - `Name`: Nome a tua scelta (es: `Cloud Artigianato`)
4. **Tab Connection**:
   - `Host name/address`: fornito dal servizio cloud
   - `Port`: 5432
   - `Username` e `Password`: credenziali fornite
5. Clic su **Save**

---

## 🛠️ Creazione Schema

1. Clic destro sul database nel pannello a sinistra → `Query Tool`
2. Incolla tutto il contenuto di `init.sql`
3. Premi **F5** per eseguire
4. Verifica che le tabelle siano state create (menu `Schemas > Tables`)

---

## ☁️ Migrazione Dati (se necessario)

1. Crea un dump locale (da server originario):
```bash
pg_dump -U tuo_utente -h localhost -d tuo_db > backup.sql
```

2. Su PGAdmin, seleziona `Query Tool` sul database cloud
3. Copia/incollo (o carica da file) il contenuto di `backup.sql` e premi **F5**

---

## 🔄 Backup

1. Clic destro sul database → `Backup`
2. Seleziona:
   - `Format`: Plain
   - `Filename`: `/percorso/locale/backup.sql`
3. Clic su **Backup**

---

## ♻️ Restore

1. Clic destro sul database → `Restore`
2. Seleziona:
   - `Format`: Plain
   - `Filename`: file `.sql` di backup
3. Clic su **Restore**

---

## 📌 Note Aggiuntive

- Verifica sempre che il tuo utente abbia i privilegi `CREATE`, `CONNECT`, `TEMP`, `USAGE`
- Per ambienti cloud protetti, abilita IP Whitelist sul provider
- Imposta backup automatici o versioning se disponibili (Render/Supabase/NeonDB)

---

