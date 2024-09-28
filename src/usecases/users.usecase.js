/* eslint-disable no-undef */
const user = require('../models/user.created.perfil')
const encrypt = require('../lib/encrypt')
const createError = require('http-errors')

async function create(userData) {
  const userFound = await user.findOne({ email: userData.email })

  if (userFound) {
    // throw new Error("Email already in use");
    throw createError(409, 'Email already in use')
  }

  userData.password = await encrypt.encrypt(userData.password)

  const newUser = await user.create(userData)
  return newUser
}

module.exports = {
  create,
}
