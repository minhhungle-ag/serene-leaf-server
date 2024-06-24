const express = require('express')
const env = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { default: mongoose } = require('mongoose')
const { default: helmet } = require('helmet')

const app = express()
env.config()

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => console.log('Connected DB'))
  .catch((error) => console.log('error: ', error))

app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

app.use('/api/posts', require('./api/routes/post'))
app.use('/api/products', require('./api/routes/products'))
app.use('/api/upload', require('./api/routes/upload'))

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server started at: ${port}`))
