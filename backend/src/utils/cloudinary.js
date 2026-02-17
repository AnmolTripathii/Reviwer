import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

// Load environment (safe to call multiple times)
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Helper to upload a buffer to Cloudinary; returns { url, public_id }
export async function uploadBuffer(buffer, options = {}) {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary not configured on server')
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
    // streamifier will be used by caller
    stream.end(buffer)
  })
}

export default cloudinary

