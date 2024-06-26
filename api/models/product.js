const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    require: true,
  },
  sku: String,
  type: String,
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
  imageUrl: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
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

module.exports = mongoose.model('Product', schema)
