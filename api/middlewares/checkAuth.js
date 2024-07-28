const jwt = require('jsonwebtoken')

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded

    next()
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = checkAuth
