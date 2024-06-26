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

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new db({
        ...req.body,
        id: uuid(),
        password: hash,
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

module.exports = router
