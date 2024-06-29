const mongoose = require('mongoose')

// Define product schema
const subscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
})

module.exports = mongoose.model('Subscribe', subscribeSchema)
