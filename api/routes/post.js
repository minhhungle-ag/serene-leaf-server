const db = require('../models/post')
const router = require('express').Router()
const uuid = require('uuid').v4

// get all
router.get('/', (req, res) => {
  const { page, limit, searchKey } = req.query

  const filters = {}
  if (searchKey)
    filters.$or = [
      { author: { $regex: searchKey, $options: 'i' } },
      { title: { $regex: searchKey, $options: 'i' } },
    ]

  const currentPage = page || 1
  const currentLimit = limit || 10
  const skip = (currentPage - 1) * limit

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
        return res.status(400).json({
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
  const newDb = new db({
    id: uuid,
    createdAt: Date.now(),
    ...req.body,
  })

  newDb
    .save()
    .then((data) => {
      res.status(200).json({
        data,
        message: 'add new success',
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

//edit
router.put('/:id', (req, res) => {
  db.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        updatedAt: Date.now(),
        ...req.body,
      },
    },
  )
    .then((data) => {
      res.status(200).json({
        data,
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
