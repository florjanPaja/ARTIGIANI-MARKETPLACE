jest.mock('./middlewares/auth.middleware', () => ({
    verifyToken: (req, _res, next) => {
      req.user = {
        id: req.headers['x-user-id'] || 'cliente-test',
        ruolo: req.headers['x-user-role'] || 'cliente'
      };
      next();
    },
    onlyAdmin: (req, res, next) => {
      if (req.user?.ruolo === 'admin') return next();
      return res.status(403).json({ message: 'Accesso riservato agli admin' });
    },
    isSelfOrAdmin: (req, res, next) => {
      const uid = req.params.id || req.params.id_utente;
      if (req.user?.id === uid || req.user?.ruolo === 'admin') return next();
      return res.status(403).json({ message: 'Accesso negato' });
    },
    isArtigiano: (req, res, next) => {
      if (['artigiano', 'admin'].includes(req.user?.ruolo)) return next();
      return res.status(403).json({ message: 'Accesso riservato ad artigiani o admin' });
    }
  }));
  