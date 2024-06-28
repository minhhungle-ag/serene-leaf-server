const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid').v4
const db = require('../models/user')

const router = express.Router()

//SIGN UP
router.post('/sign-up', async (req, res) => {
  const { email, password } = req.body
  const checkUser = await db.findOne({ email })

  if (checkUser) {
    return res.status(409).json({
      message: 'Mail exits',
    })
  }

  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file && !req.body.imageUrl) {
      return res.status(404).json({
        message: 'No file uploaded.',
        error: 1,
      })
    }

    bcrypt
      .hash(password, 10)
      .then((hash) => {
        const user = new db({
          ...req.body,
          id: uuid(),
          password: hash,
          imageUrl: req.file ? req.file.path : req.body.imageUrl,
          createdAt: new Date(),
        })

        user
          .save()
          .then(() => {
            res.status(200).json({
              message: 'success!',
              error: 0,
            })
          })
          .catch((error) => {
            res.status(500).json({
              message: error.message,
              error: 1,
            })
          })
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message,
          error: 1,
        })
      })
  })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await db.findOne({ email })

  if (!user) {
    return res.status(409).json({
      message: "Mail not found, user does't exits",
      error: 1,
    })
  }

  bcrypt.compare(password, user.password, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
        error: 1,
      })
    }

    if (!result) {
      return res.status(404).json({
        message: 'not found',
        error: 1,
      })
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      },
    )

    res.status(200).json({
      message: 'success!',
      error: 0,
      data: {
        token,
        id: user.id,
      },
    })
  })
})

router.get('/users', (req, res) => {
  const { page, limit, searchKey, category } = req.query

  const filters = {}

  if (searchKey) {
    filters.$or = [
      { email: { $regex: searchKey, $options: 'i' } },
      { fullName: { $regex: searchKey, $options: 'i' } },
    ]
  }

  const currentPage = page || 1
  const currentLimit = limit || 10
  const skip = (currentPage - 1) * limit

  db.find(filters)
    .skip(skip)
    .sort({ createdAt: -1 })
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

router.get('/users/:id', (req, res) => {
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

router.post('/users/:id', (req, res) => {
  upload.single('imageUrl')(req, res, (error) => {
    if (error) {
      return res.status(500).json({
        message: `${error}`,
        error: 1,
      })
    }

    if (!req.file && !req.body.imageUrl) {
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

module.exports = router
