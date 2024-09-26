const mongoose = require('mongoose')

const nameModel = 'Company'
const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxLength: 50,
    minLength: 3
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

module.exports = mongoose.model(nameModel, schema)
