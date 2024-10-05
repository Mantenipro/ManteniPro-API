/* eslint-disable no-undef */
const bcrypt = require('bcryptjs')
const moment = require('moment')
const Register = require('../models/registerModel')
const userPerfil = require('../models/user.created.perfil') // Asegúrate que el modelo esté bien importado
const { sendActivationEmail } = require('../services/emailService')
const { createUserProfile } = require('../services/userProfileService')
const { encrypt } = require('../utils/authUtils') // Función de encriptación

// Pre-save hook: Este hook se ejecuta antes de guardar un nuevo documento
Register.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const activationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()

      // Enviar email de activación
      await sendActivationEmail(this.email, activationCode, this._id)

      // Generar el hash del código de activación
      const salt = await bcrypt.genSalt(10)
      this.activationCodeHash = await bcrypt.hash(activationCode, salt)

      // Establecer la expiración del código de activación (7 días)
      this.activationCodeExpiration = moment().add(7, 'days').toDate()

      // Encriptar la contraseña antes de guardar
      this.password = await encrypt(this.password)

      next() // Continuar con el flujo de guardado
    } catch (error) {
      next(error) // Pasar el error al siguiente middleware
    }
  } else {
    next() // Si no es un documento nuevo, continuar sin hacer cambios
  }
});

// Post-save hook: Este hook se ejecuta después de guardar un documento
Register.post('save', async function (doc) {
  process.nextTick(async () => {
    try {
      const existingUser = await userPerfil.findOne({ email: doc.email })

      if (existingUser) {
        console.error(`El correo ${doc.email} ya tiene un perfil creado.`)
        return 
      }

      const perfilData = {
        name: doc.fullname,
        lastname: 'defaultLastname',
        email: doc.email,
        password: doc.password,
        role: 'defaultRole',
        type: 'defaultType',
        photo: 'defaultPhoto'
      }

      try {
        await userPerfil.create(perfilData)
        console.log('Perfil de usuario creado con éxito.')
      } catch (error) {
        if (error.code === 11000) {
          console.error(
            `Error: El correo ${perfilData.email} ya está registrado como perfil.`
          )
        } else {
          console.error('Error creando el perfil del usuario:', error)
        }
      }
    } catch (error) {
      console.error('Error en el post save hook:', error)
    }
  })
})

module.exports = Register
