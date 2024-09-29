/* eslint-disable no-undef */
const mongoose = require('mongoose')

const modelName = 'Register'

const registerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  zipCode: {
    type: String,
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPerfil',
    required: true
  },
  fechaRegistro: {type: Date, default: Date.now}
})

const model = mongoose.model(modelName, registerSchema)

module.exports = model
