/* eslint-disable no-undef */
const register = require('../models/formRegister')
const encrypt = require('../lib/encrypt')
const createError = require('http-errors')

async function create(userData) {
  const registerFound = await register.findOne({ email: userData.email })

  if (registerFound) {
    // throw new Error("Email already in use");
    throw createError(409, 'Email already in use')
  }

  userData.password = await encrypt.encrypt(userData.password)

  const newRegister = await register.create(userData)
  return newRegister
}

module.exports = {
  create
}
