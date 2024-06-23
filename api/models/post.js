const { default: mongoose } = require('mongoose')

const schema = new mongoose.Schema({
  id: String, //uuid
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  imageUrl: {
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

module.exports = mongoose.model('Post', schema)
