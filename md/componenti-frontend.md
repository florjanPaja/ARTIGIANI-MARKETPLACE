# Documentazione Componenti Frontend - Artigianato Online

Questo file descrive le **pagine HTML** e i **file JavaScript** associati per ogni ruolo utente.

---

## 👤 Cliente

### HTML:
- `pages/cliente/catalogo.html`: catalogo prodotti con filtri e dettagli
- `pages/cliente/cliente-carrello.html`: carrello utente
- `pages/cliente/ordini.html`: storico ordini
- `pages/cliente/ordine-successo.html`: conferma ordine
- `pages/cliente/layout.html`: layout dinamico con menu

### JS:
- `js/layout.js`: navigazione dinamica e controllo autenticazione
- `js/cliente-carrello.js`: gestione carrello (add, remove, update)
- `js/checkout.js`: checkout ordine
- `js/ordini.js`: carica ordini utente
- `js/segnalazioni.js`: invio segnalazioni
- `js/categorie.js`: filtro prodotti
- `js/ordine-successo.js`: redirect post-pagamento

---

## 🧑‍🎨 Artigiano

### HTML:
- `pages/artigiano/articoli.html`: lista articoli pubblicati (CRUD)
- `pages/artigiano/ordini.html`: ordini ricevuti
- `pages/artigiano/profilo.html`: modifica profilo
- `pages/artigiano/segnalazioni.html`: centro supporto
- `pages/artigiano/layout.html`: struttura pagina

### JS:
- `js/articoli.js`: CRUD articoli con preview immagini e sconti
- `js/ordini.js`: visualizza ordini ricevuti
- `js/profilo.js`: modifica profilo artigiano
- `js/segnalazioni.js`: supporto e messaggi
- `js/layout.js`: menu dinamico

---

## 🛠️ Amministratore

### HTML:
- `pages/admin/utenti.html`: elenco utenti registrati
- `pages/admin/prodotti.html`: articoli venduti
- `pages/admin/ordini.html`: ordini globali
- `pages/admin/segnalazioni.html`: gestione segnalazioni
- `pages/admin/layout.html`: struttura pagine admin

### JS:
- `js/utenti.js`: gestione utenti (attiva/disattiva)
- `js/prodotti.js`: rimozione articoli, stato
- `js/ordini.js`: gestione ordini
- `js/segnalazioni.js`: messaggi admin-utente
- `js/layout.js`: navigazione admin

---

## 🧩 Componenti condivisi

- `components/login-form.html`: login form integrabile
- `components/register-form.html`: registrazione
- `utils/ui.js`: funzioni di supporto (toast, loader, ecc.)
- `dashboard.js`: grafici e visualizzazioni aggregate (se usato)

