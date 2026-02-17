import multer from 'multer'

// Memory storage: required for streaming buffer to Cloudinary
const storage = multer.memoryStorage()

// Accept images and PDF
const fileFilter = (req, file, cb) => {
  const allowed = /^(image\/(jpeg|png|gif|webp))|(application\/pdf)$/
  if (allowed.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Allowed: images (jpeg, png, gif, webp), PDF.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

export default upload

