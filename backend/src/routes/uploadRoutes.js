import express from 'express'
import multer from 'multer'
import streamifier from 'streamifier'
import cloudinary from '../utils/cloudinary.js'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' })

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER || 'Reviwer' },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )
        streamifier.createReadStream(buffer).pipe(stream)
      })
    }

    const result = await streamUpload(req.file.buffer)
    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    console.error('Upload error', err)
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
})

export default router

