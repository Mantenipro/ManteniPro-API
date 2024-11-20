/* eslint-disable no-undef */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({

  name: {
    type: String,
    require: true,
    maxLength: 50,
    minLength: 3
  },
  email: {
    type: String,
    required: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
  },
  password: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    require: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies'
  },
  created_at: {
    type: Date,
    require: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    require: true,
    default: Date.now
  }
})

module.exports = mongoose.model('engineers', schema)
