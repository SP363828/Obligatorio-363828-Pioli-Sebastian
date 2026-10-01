const multer = require('multer');

// memoryStorage: el archivo queda en req.file.buffer, nunca se escribe a
// disco. Importante en Vercel, donde el filesystem es efímero/read-only.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(Object.assign(new Error('El archivo debe ser una imagen'), { status: 400 }));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;