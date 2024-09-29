/* eslint-disable no-undef */
const mongoose = require('mongoose')
const userPerfil = require('./user.created.perfil') // Importa el modelo userPerfil

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
  fechaRegistro: { type: Date, default: Date.now }
})

// Middleware para crear un registro en user.created.perfil después de guardar un documento en Register
registerSchema.post('save', async function (doc) {
  try {
    const perfilData = {
      name: doc.fullname,
      lastname: 'defaultLastname', // Ajusta según tus necesidades
      email: doc.email,
      password: doc.password,
      role: 'defaultRole', // Ajusta según tus necesidades
      type: 'defaultType', // Ajusta según tus necesidades
      photo: 'defaultPhoto' // Ajusta según tus necesidades
    }
    await userPerfil.create(perfilData)
  } catch (err) {
    console.error('Error creating userPerfil document', err)
  }
})

const model = mongoose.model(modelName, registerSchema)

module.exports = model
