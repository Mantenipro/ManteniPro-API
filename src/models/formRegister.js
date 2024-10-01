/* eslint-disable no-undef */
const mongoose = require('mongoose')

const nodemailer = require('nodemailer')

const userPerfil = require('./user.created.perfil')

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
  fechaRegistro: { type: Date, default: Date.now },
  isActive: {
    type: Boolean,
    default: false
  },
  activationDeadline: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
  },
})

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'mantenipro6@gmail.com', 
    pass: 'cwqnmwkddweqioxl'
  }
})

registerSchema.post('save', function (doc) {
  process.nextTick(async () => {
    try {
      // Enviar el correo de agradecimiento
      const mailOptions = {
        from: 'mantenipro6@gmail.com',
        to: doc.email,
        subject: 'Gracias por registrarse',
        text: 'Gracias por registrarse. Tienes 7 días para realizar la activación de tu cuenta.'
      }

      await transporter.sendMail(mailOptions)

      // Crear el perfil del usuario
      const perfilData = {
        name: doc.fullname,
        lastname: 'defaultLastname',
        email: doc.email,
        password: doc.password,
        role: 'defaultRole',
        type: 'defaultType',
        photo: 'defaultPhoto'
      }
      await userPerfil.create(perfilData)
    } catch (error) {
      console.error('Error in post save hook:', error)
    }
  })
})

const model = mongoose.model(modelName, registerSchema)

module.exports = model
