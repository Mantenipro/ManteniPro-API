/* eslint-disable no-undef */
const createError = require('http-errors')
const users = require('../models/user.created.perfil')
const jwt = require('../lib/jwt')
const encrypt = require('../lib/encrypt')

async function login(email, password) {
  // Verificar si el email existe en la base de datos
  const user = await users.findOne({ email })

  if (!user) {
    // Lanzar un error 404 si el email no se encuentra
    throw createError(404, 'Email no encontrado')
  }

  // Verificar si la contraseña es válida
  const isPasswordValid = await encrypt.compare(password, user.password)

  if (!isPasswordValid) {
    // Lanzar un error 401 si la contraseña es incorrecta
    throw createError(401, 'Contraseña incorrecta')
  }

  // Generar el token JWT si el email y la contraseña son correctos
  const token = jwt.sign({ id: user._id })

  return token
}

module.exports = {
  login
}
