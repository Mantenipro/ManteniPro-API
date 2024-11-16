/* eslint-disable no-undef */
const mongoose = require('mongoose')
const modelName = 'userPerfil'; 

const userPerfilSchema = new mongoose.Schema(
  {
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
      default: 'admin' 
    },
    type: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      default: null,
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
    },
    suscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    accountStatus: {
      //Solo para los usuarios creados por el administrador
      type: Boolean,
      default: false
    },
    activationCodeHash: {
      type: String
    },
    activationCodeExpiration: {
      type: Date
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    unlockRequested: {
      type: Boolean,
      default: false
    },
    mustChangePassword: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

const model = mongoose.model(modelName, userPerfilSchema)

module.exports = model