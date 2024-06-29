const express = require('express')
const db = require('../models/subscribe')

const router = express.Router()

router.post('/', async (req, res) => {
  const checkSubscribe = await db.find({ email: req.body.email })

  if (checkSubscribe?.length > 0) {
    return res.status(400).json({
      message: 'Email already exists',
      error: 1,
      data: null,
    })
  }

  try {
    const subscribe = new db({
      ...req.body,
      createdAt: Date.now(),
    })

    await subscribe.save()

    res.status(201).json({
      message: 'Successfully!',
      error: 0,
      data: subscribe,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: 1,
      data: null,
    })
  }
})

module.exports = router
