const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    require: true,
  },

  type: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  shortDescription: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
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
