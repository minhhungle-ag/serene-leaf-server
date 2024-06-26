const router = require('express').Router()
const upload = require('../middlewares/upload')
const db = require('../models/product')
const uuid = require('uuid').v4

router.get('/', (req, res) => {
  const { page, limit, searchKey, category } = req.query

  const filters = {}

  if (searchKey) {
    filters.$or = [{ title: { $regex: searchKey, $options: 'i' } }]
  }

  if (category) {
    filters.category = category
  }

  const currentPage = page || 1
  const currentLimit = limit || 10
  const skip = (currentPage - 1) * currentLimit

  db.find(filters)
    .skip(skip)
    .limit(currentLimit)
    .sort({ createdAt: -1 })
    .exec()
    .then(async (data) => {
      const total = await db.countDocuments(filters)
      const totalPage = Math.ceil(total / currentLimit)
      res.status(200).json({
        data: {
          data,
          pagination: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPage,
          },
        },
        message: 'success',
        error: 0,
      })
    })
    .catch((error) => {
      res.status(500).json({
        error: 1,
        message: `${error}`,
      })
    })
})

router.get('/:id', (req, res) => {
  db.findOne({ id: req.params.id })
    .then((data) => {
      if (!data) return res.status(400).json({ message: 'not found', error: 1 })

      res.status(200).json({
        data,
        message: 'success',
        error: 0,
      })
    })
    .catch((error) => {
      res.status(500).json({
        error: 1,
        message: `${error}`,
      })
    })
})

router.post('/', (req, res) => {
  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file || !res.body.imageUrl) {
      return res.status(404).json({
        message: 'No file uploaded.',
        error: 1,
      })
    }

    const newDb = new db({
      ...req.body,
      id: uuid(),
      imageUrl: req.file.path,
      createdAt: Date.now(),
    })

    newDb
      .save()
      .then((data) => {
        res.status(201).json({
          error: 0,
          message: `success`,
        })
      })
      .catch((error) => {
        res.status(500).json({
          error: 1,
          message: `${error}`,
        })
      })
  })
})

router.put('/:id', (req, res) => {
  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file || !res.body.imageUrl) {
      return res.status(404).json({
        message: 'No file uploaded.',
        error: 1,
      })
    }

    db.findOneAndUpdate(
      { id: req.params.id },
      {
        ...req.body,
        imageUrl: req.file ? req.file.path : req.body.imageUrl,
        updatedAt: Date.now(),
      },
    )
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: 'Product not found', error: 1 })
        }

        res.status(201).json({
          error: 0,
          message: 'success',
          data,
        })
      })
      .catch((error) => {
        res.status(500).json({
          error: 1,
          message: `${error}`,
        })
      })
  })
})

router.delete('/:id', (req, res) => {
  db.deleteOne({ id: req.params.id })
    .then((data) => {
      res.status(201).json({
        error: 0,
        message: 'success',
        data,
      })
    })
    .catch((error) => {
      res.status(500).json({
        error: 1,
        message: `${error}`,
      })
    })
})

module.exports = router
