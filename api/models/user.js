const { default: mongoose } = require('mongoose')

const schema = new mongoose.Schema({
  id: String,
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  address: String,
  role: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  description: String,
  avatar: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  birthday: {
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

module.exports = mongoose.model('Users', schema)
