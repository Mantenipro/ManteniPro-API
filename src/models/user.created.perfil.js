/* eslint-disable no-undef */
const mongoose = require('mongoose')
const modelName = 'userPerfil'; 

const userPerfilSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: false
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
  role: {
    type: String,
    enum: ['admin', 'tecnico', 'usuario'],
    default: 'admin' // Por defecto es "usuario"
  },
  type: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company' // Referencia al modelo de empresa
  },
  formRegister: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register' // Referencia al modelo de empresa
  }
})

const model = mongoose.model(modelName, userPerfilSchema)

module.exports = model