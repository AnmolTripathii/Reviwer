import express from 'express'
import upload from '../middleware/uploadMulter.js'
import { uploadSingle, uploadMultiple } from '../controllers/uploadController.js'

const router = express.Router()

// Single file upload: field name 'file'
router.post('/', upload.single('file'), uploadSingle)

// Multiple files upload: field name 'files'
router.post('/multiple', upload.array('files'), uploadMultiple)

// Health/check endpoint for Cloudinary configuration
router.get('/check', (req, res) => {
  const configured = !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME)
  res.json({ configured })
})

// Health/check endpoint for Cloudinary configuration
router.get('/check', (req, res) => {
  const configured = !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME)
  res.json({ configured })
})

export default router

