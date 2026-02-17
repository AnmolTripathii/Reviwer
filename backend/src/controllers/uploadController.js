import cloudinary from '../utils/cloudinary.js'

const FOLDER = process.env.CLOUDINARY_FOLDER || 'reviwer'

export const uploadSingle = async (req, res) => {
  try {
    // Check Content-Type for multipart
    const ct = req.headers['content-type'] || ''
    if (!ct.includes('multipart/form-data')) {
      console.error('Upload request missing multipart/form-data Content-Type', { contentType: ct })
      return res.status(400).json({ error: 'Request must be multipart/form-data. Ensure FormData is sent and do not set Content-Type header manually.' })
    }

    if (!req.file) {
      console.error('Upload request arrived but multer did not populate req.file. Headers:', {
        contentType: ct,
        length: req.headers['content-length']
      })
      return res.status(400).json({ error: 'No file provided. Use field name: file' })
    }

    // Log request headers for debugging preflight/auth issues
    console.log('Upload headers:', {
      origin: req.headers.origin,
      authorization: !!req.headers.authorization,
      'content-type': req.headers['content-type']
    })

    const result = await new Promise((resolve, reject) => {
      const opts = { folder: FOLDER, resource_type: 'auto' }
      const stream = cloudinary.uploader.upload_stream(opts, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
      stream.end(req.file.buffer)
    })

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
}

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files provided. Use field name: files' })
    }

    const results = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: FOLDER, resource_type: 'auto' }, (err, result) => {
              if (err) reject(err)
              else resolve(result)
            })
            stream.end(file.buffer)
          })
      )
    )

    res.status(200).json({
      files: results.map((r) => ({ url: r.secure_url, publicId: r.public_id }))
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
}

export default { uploadSingle, uploadMultiple }

