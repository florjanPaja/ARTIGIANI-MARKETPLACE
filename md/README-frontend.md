# Frontend - Artigianato Online

Questo è il frontend dell'applicazione **Artigianato Online**, contenuto nel percorso:  
`backend/static/`

---

## 📁 Struttura delle cartelle

```
static/
├── index.html                  # Entry point iniziale
├── assets/                     # Risorse statiche (CSS, immagini, ecc.)
│   └── css/style.css
├── components/                 # Componenti riutilizzabili (es. login, register)
│   ├── login-form.html
│   └── register-form.html
├── js/                         # Script globali o condivisi
│   └── dashboard.js
├── utils/                      # Utility JS condivise (es: ui.js)
├── pages/
│   ├── admin/                  # Pagine e script del pannello Admin
│   ├── cliente/                # Pagine e script Cliente
│   └── artigiano/              # Pagine e script Artigiano
```

---

## 📦 Tecnologie utilizzate

- HTML5, CSS3, JavaScript Vanilla
- Moduli JS suddivisi per ruolo
- Layout caricati dinamicamente
- Comunicazione con il backend via `fetch()`/AJAX
- Nessun framework frontend usato (es. React/Vue)

---

## 🚀 Avvio in produzione

Essendo un frontend statico, viene servito direttamente dal backend Express tramite:

```
app.use(express.static(path.join(__dirname, 'static')));
```

Non è necessario alcun build step. Il deployment avviene insieme al backend (es: Docker, Heroku, Render).

---

## ✅ Compatibilità Browser

Testato su:
- Google Chrome (desktop)
- Mozilla Firefox
- Safari
- Microsoft Edge

Responsive tramite CSS media queries.

---

