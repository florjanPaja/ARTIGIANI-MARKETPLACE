const jwt = require('../utils/jwt');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token mancante o non valido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded; // es. { id, ruolo }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token scaduto o non valido' });
  }
};

exports.onlyAdmin = (req, res, next) => {
  if (req.user?.ruolo !== 'admin') {
    return res.status(403).json({ message: 'Accesso riservato agli amministratori' });
  }
  next();
};
exports.isSelfOrAdmin = (req, res, next) => {
  const loggedUserId = req.user?.id;
  const targetId = parseInt(req.params.id, 10);

  if (req.user?.ruolo === 'admin' || loggedUserId === targetId) {
    return next();
  }

  return res.status(403).json({ message: 'Accesso negato' });
};
