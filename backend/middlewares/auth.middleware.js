const jwt = require('../utils/jwt');

// ✅ Verifica JWT e allega utente decodificato
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verifyToken(token); // { id, ruolo }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token scaduto o non valido' });
  }
};

// ✅ Solo admin
exports.onlyAdmin = (req, res, next) => {
  if (req.user?.ruolo !== 'admin') {
    return res.status(403).json({ message: 'Accesso riservato agli amministratori' });
  }
  next();
};

// ✅ Accesso al proprio profilo o admin
exports.isSelfOrAdmin = (req, res, next) => {
  const loggedUserId = req.user?.id;
  const paramId = req.params.id || req.params.id_utente;

  if (req.user?.ruolo === 'admin' || loggedUserId === paramId) {
    return next();
  }

  return res.status(403).json({ message: 'Accesso negato: non sei autorizzato' });
};

// ✅ Solo artigiano (o admin)
exports.isArtigiano = (req, res, next) => {
  if (req.user?.ruolo === 'artigiano' || req.user?.ruolo === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accesso riservato ad artigiani o admin' });
};
