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
  subscription_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subscriptions'
  },
  phone_number: {
    type: Number,
    require: true,
    maxLength: 10,
    minLength: 10
  },
  address: {
    type: String,
    require: true,
    maxLength: 250,
    minLength: 10
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    require: true
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

module.exports = mongoose.model('companies', schema)
