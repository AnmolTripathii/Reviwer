const cloudinary = require('../config/cloudinary');

const FOLDER = process.env.CLOUDINARY_FOLDER || 'reviwer';

const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided. Use field name: file' });
    }

    const result = await new Promise((resolve, reject) => {
      const opts = { folder: FOLDER, resource_type: 'auto' };
      const stream = cloudinary.uploader.upload_stream(opts, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
};

const uploadMultiple = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: 'No files provided. Use field name: files' });
    }

    const results = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: FOLDER, resource_type: 'auto' }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
              })
              .end(file.buffer);
          })
      )
    );

    res.status(200).json({
      files: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
};

module.exports = { uploadSingle, uploadMultiple };
