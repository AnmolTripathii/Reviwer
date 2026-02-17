const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');

const handleMulterError = (err, res) => {
  const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 10MB)' : err.message;
  return res.status(400).json({ error: msg });
};

// Single file: POST /api/upload
router.post(
  '/',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) return handleMulterError(err, res);
      next();
    });
  },
  uploadSingle
);

// Multiple files: POST /api/upload/multiple
router.post(
  '/multiple',
  (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
      if (err) return handleMulterError(err, res);
      next();
    });
  },
  uploadMultiple
);

module.exports = router;
