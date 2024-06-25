const express = require('express')
const upload = require('../middlewares/upload')
const router = express.Router()

// Endpoint to upload single image
router.post('/', (req, res) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded.',
        error: 1,
      })
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      url: req.file.path,
      error: 0,
    })
  })
})

module.exports = router
