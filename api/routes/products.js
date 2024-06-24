const router = require('express').Router()
const db = require('../models/product')
const uuid = require('uuid').v4
router.get('/', (req, res) => {
  const { page, limit, searchKey } = req.query

  const filters = {}

  if (searchKey) {
    filters.$or = [{ title: { $regex: searchKey, $options: 'i' } }]
  }

  const currentPage = page || 1
  const currentLimit = limit || 10
  const skip = (currentPage - 1) * currentLimit

  db.find(filters)
    .skip(skip)
    .limit(currentLimit)
    .exec()
    .then(async (data) => {
      const total = await db.countDocuments(filters)
      const totalPage = Math.ceil(total / currentLimit)
      res.status(200).json({
        data: {
          data,
          page: currentPage,
          limit: currentLimit,
          total,
          totalPage,
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
  const newDb = new db({
    ...req.body,
    id: uuid(),
    createdAt: Date.now(),
  })

  newDb
    .save()
    .then((data) => {
      res.status(201).json({
        error: 0,
        message: `success`,
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

router.put('/:id', (req, res) => {
  db.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        ...req.body,
        updatedAt: Date.now(),
      },
    },
  )
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
