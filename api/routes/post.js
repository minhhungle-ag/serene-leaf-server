const upload = require('../middlewares/upload')
const db = require('../models/post')
const router = require('express').Router()
const uuid = require('uuid').v4

// get all
router.get('/', (req, res) => {
  const { page, limit, searchKey, order } = req.query

  const filters = {}
  if (searchKey)
    filters.$or = [
      { author: { $regex: searchKey, $options: 'i' } },
      { title: { $regex: searchKey, $options: 'i' } },
    ]

  const sortOrder = order === 'desc' ? -1 : 1

  const currentPage = page || 1
  const currentLimit = limit || 10
  const skip = (currentPage - 1) * limit

  db.find(filters)
    .skip(skip)
    .sort({ title: parseInt(sortOrder), createdAt: -1 })
    .limit(currentLimit)
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
        message: 'get all success',
        error: 0,
      })
    })
    .catch((error) => {
      res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    })
})

//get by id
router.get('/:id', (req, res) => {
  db.findOne({ id: req.params.id })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `Not found`,
          error: 1,
        })
      }

      res.status(200).json({
        data,
        message: 'get by id success',
        error: 0,
      })
    })
    .catch((error) => {
      res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    })
})

//add
router.post('/', (req, res) => {
  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file && !res.body.imageUrl) {
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

//edit
router.put('/:id', (req, res) => {
  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file && !res.body.imageUrl) {
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
      .then(() => {
        res.status(200).json({
          message: 'edit success',
          error: 0,
        })
      })
      .catch((error) => {
        res.status(500).json({
          message: `${error}`,
          error: 1,
        })
      })
  })
})

//remove
router.delete('/:id', (req, res) => {
  db.findOneAndDelete({ id: req.params.id })
    .then((data) => {
      res.status(200).json({
        data,
        message: 'remove success',
        error: 0,
      })
    })
    .catch((error) => {
      res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    })
})

module.exports = router
