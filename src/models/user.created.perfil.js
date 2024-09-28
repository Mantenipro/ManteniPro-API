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
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  }
})

const model = mongoose.model(modelName, userPerfilSchema)

module.exports = model