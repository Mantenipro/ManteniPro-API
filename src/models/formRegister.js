/* eslint-disable no-undef */
const mongoose = require('mongoose')
require('dotenv').config()
const preSaveHook = require('./hooks/preSaveHook')
const postSaveHook = require('./hooks/postSaveHook')

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

registerSchema.pre('save', preSaveHook)
registerSchema.post('save', postSaveHook)

const model = mongoose.model(modelName, registerSchema)
module.exports = model
