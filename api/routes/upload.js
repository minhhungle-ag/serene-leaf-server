const express = require('express')
const uploadMiddleware = require('../middlewares/upload')
const router = express.Router()
const fs = require('fs')

const singleUpload = uploadMiddleware.single('imageUrl')
const multiUpload = uploadMiddleware.array('imageUrl', 4)

// Route to handle single image upload
router.post('/singleUpload', (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err, error: 1 })

    if (req.file == undefined)
      return res.status(400).json({ message: 'No file selected!', error: 1 })

    res.json({
      message: 'File uploaded!',
      error: 0,
      data: {
        pathname: `uploads/${req.file.filename}`,
        ...req.file,
      },
    })
  })
})

// Route to handle multiple image uploads
router.post('/uploadMultiple', (req, res) => {
  multiUpload(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err })
    }

    if (req.files.length === 0) {
      return res.status(400).send({ message: 'No files selected!' })
    }

    const data = req.files.map((file) => ({
      pathname: `uploads/${file.filename}`,
      ...file,
    }))
    res.send({ message: 'Files uploaded!', data })
  })
})

// remove an image from uploads file
router.post('/remove', (req, res) => {
  fs.unlink(`./uploads/${req.body.filename}`, (error) => {
    if (error)
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })

    res.send({
      message: `Image successfully deleted`,
      error: 0,
    })
  })
})

module.exports = router
