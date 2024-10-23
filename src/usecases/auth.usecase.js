/* eslint-disable no-undef */
const createError = require('http-errors')
const users = require('../models/user.created.perfil')
const jwt = require('../lib/jwt')
const encrypt = require('../lib/encrypt')

async function login(email, password) {
  // Verificar si el email existe en la base de datos (sin populate para buscar solo el email y la contraseña)
  const user = await users.findOne({ email })

  if (!user) {
    // Lanzar un error 404 si el email no se encuentra
    throw createError(404, 'Email no encontrado')
  }

  // Verificar si la contraseña es válida
  const isPasswordValid = await encrypt.compare(password, user.password)

  if (!isPasswordValid) {
    // Añadir logs para depurar las contraseñas
    console.log('Contraseña proporcionada:', password)
    console.log('Contraseña almacenada:', user.password)
    console.log('Resultado de la comparación:', isPasswordValid)
    // Lanzar un error 401 si la contraseña es incorrecta
    throw createError(401, 'Contraseña incorrecta')
  }

  // Si el rol es "admin", verificar la activación de la cuenta
  if (user.role === 'admin') {
    // Verificar si la cuenta está activa (buscar el mismo usuario pero con populate para obtener los datos relacionados)
    const userWithForm = await users.findOne({ email }).populate('formRegister')

    // Añadimos un console.log para verificar si el populate trae los datos esperados
    console.log(
      'Resultado del populate:',
      JSON.stringify(userWithForm, null, 2)
    )

    // Validación mejorada para evitar posibles problemas
    if (!userWithForm.formRegister) {
      console.log(
        'No se encontró información de activación en formRegister asociado al usuario.'
      )
      throw createError(403, 'No se encontró información de activación.')
    }

    if (!userWithForm.formRegister.isActive) {
      console.log(
        'Estado de activación de la cuenta:',
        userWithForm.formRegister.isActive
      )
      throw createError(403, 'Cuenta no activada')
    }

    // Imprimir el objeto user en la consola
    console.log('Usuario encontrado y cuenta activada:', userWithForm)
  }
  const token = jwt.sign({ id: user._id })
  return token
}

module.exports = {
  login
}
