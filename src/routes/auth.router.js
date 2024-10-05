/* eslint-disable no-undef */
const express = require('express')

const authUseCase = require('../usecases/auth.usecase')

const router = express.Router()

// POST /auth/login
router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body
    const token = await authUseCase.login(email, password)

    // Si el login es exitoso, devolver el token
    response.json({
      success: true,
      data: { token }
    })
  } catch (error) {
    // Verifica si el error proviene del email o contraseña
    let statusCode = 401
    let errorMessage = 'Credenciales incorrectas'

    if (error.message === 'Email no encontrado') {
      statusCode = 404 // Not Found
      errorMessage = 'Correo electrónico no encontrado'
    } else if (error.message === 'Contraseña incorrecta') {
      statusCode = 401 // Unauthorized
      errorMessage = 'Contraseña incorrecta'
    }

    response.status(statusCode).json({
      success: false,
      error: errorMessage
    })
  }
})

module.exports = router
