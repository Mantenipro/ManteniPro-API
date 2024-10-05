/* eslint-disable no-undef */
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const userPerfil = require('./user.created.perfil')
const { google } = require('googleapis')
const modelName = 'Register'
require('dotenv').config()

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
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  activationCodeHash: {
    type: String
  },
  activationCodeExpiration: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: false
  },
  updated_at: {
    type: Date,
    require: true,
    default: Date.now
  }
})

const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  'https://developers.google.com/oauthplayground' 
)

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN 
})

async function getAccessToken() {
  const { token } = await oauth2Client.getAccessToken()
  return token
}

async function createTransporter() {
  const accessToken = await getAccessToken()
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER, 
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  })
}

registerSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const activationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()

      const activationLink = `http://localhost:3000/activate?id=${this._id}`
      const transporter = await createTransporter()
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: this.email,
        subject: 'Activación de tu cuenta',
        text: `Gracias por registrarte. Tu código de activación es: ${activationCode}. 
               Por favor, haz clic en el siguiente enlace para activar tu cuenta: ${activationLink}`
      }

      await transporter.sendMail(mailOptions)

      const salt = await bcrypt.genSalt(10)
      this.activationCodeHash = await bcrypt.hash(activationCode, salt)

      this.activationCodeExpiration = moment().add(7, 'days').toDate()

      next() 
    } catch (error) {
      next(error) 
    }
  } else {
    next()
  }
})

registerSchema.post('save', async function (doc) {
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

const model = mongoose.model(modelName, registerSchema)
module.exports = model
