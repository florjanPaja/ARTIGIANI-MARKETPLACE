const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotte API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/utenti', require('./routes/utenti.routes'));
app.use('/api/articoli', require('./routes/articoli.routes'));
app.use('/api/ordini', require('./routes/ordini.routes'));
app.use('/api/carrello', require('./routes/carrello.routes'));
app.use('/api/pagamenti', require('./routes/pagamenti.routes'));
app.use('/api/spedizioni', require('./routes/spedizioni.routes'));

// Gestione errori
app.use(require('./middlewares/errorHandler'));

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato sulla porta ${PORT}`);
});


module.exports = app;
