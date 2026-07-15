const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const { generateUploadFilename } = require('../utils/helpers.js');

const uploadsDir = process.env.UPLOADS_DIR ?? path.resolve('uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, generateUploadFilename(file.originalname)),
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, or WEBP images are allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, uploadsDirPath: uploadsDir };