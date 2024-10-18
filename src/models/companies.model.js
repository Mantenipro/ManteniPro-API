/* eslint-disable no-undef */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    required: true
  },
  subscription_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  stripeCustomerId: {
    type: String,
    ref: 'User',
    default: null // Referencia al modelo User
  },
  phone_number: {
    type: Number,
    required: false,
    maxLength: 10,
    minLength: 10
  },
  address: {
    type: String,
    required: true,
    maxLength: 250,
    minLength: 10
  },
  isActive: {
    type: Boolean,
    default: false
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Company', schema)
