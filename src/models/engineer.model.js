const mongoose = require('mongoose')

const nameModel = 'Engineer'
const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxLength: 50,
    minLength: 3
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    require: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
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
