const multer = require('multer');
const path = require('path');

// Percorso di salvataggio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img/'); // salva in project-root/img/
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

// Filtra solo immagini accettabili
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato immagine non supportato. Usa JPG, PNG o WebP.'), false);
  }
};

// Configurazione multer completa
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per file
    files: 5
  }
});

module.exports = upload;
