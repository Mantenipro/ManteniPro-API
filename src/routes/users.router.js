/* eslint-disable no-undef */
const express = require('express')
const usersUseCase = require('../usecases/users.usecase')
const auth = require('../middleware/auth.middleware')

const router = express.Router()

// GET /users
router.get('/', auth, async (request, response) => {
  try {
    const users = await usersUseCase.getAll()

    response.json({
      success: true,
      data: { users }
    })
  } catch (error) {
    response.status(error.status || 500)
    response.json({
      success: false,
      error: error.message
    })
  }
})

// POST /users
router.post('/', auth, async (request, response) => {
  try {
    const creatorRole = request.user.role // Obtenemos el rol del creador desde el token

    // Crear el usuario con validación de roles
    const userCreated = await usersUseCase.create(request.body, creatorRole)

    response.json({
      success: true,
      data: { user: userCreated }
    })
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message
    })
  }
})


// GET /users/:id/profile
router.get('/profile', auth, async (request, response) => {
  try {
    // Obtener el id del usuario desde el token decodificado
    const userId = request.user.id

    // Obtener la información del usuario desde la base de datos usando el id del token
    const user = await usersUseCase.getById(userId)
    const { name, role } = user

    response.json({
      success: true,
      data: { name, role }
    })
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message
    })
  }
})

// GET /users/:id
router.get('/:id', auth, async (request, response) => {
  try {
    const user = await usersUseCase.getById(request.params.id)

    response.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    response.status(error.status || 500)
    response.json({
      success: false,
      error: error.message
    })
  }
})



module.exports = router
