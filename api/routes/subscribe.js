const express = require('express')

const router = express.Router()

router.post('/', async (req, res) => {
  const subscribeList = await Subscribe.find({ email: req.body.email })

  if (subscribeList) {
    return res.status(400).json({
      message: 'Email already exists',
      error: 1,
      data: null,
    })
  }

  try {
    const subscribe = new Subscribe({
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
