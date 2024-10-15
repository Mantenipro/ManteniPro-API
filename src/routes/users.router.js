/* eslint-disable no-undef */
const express = require('express')
const usersUseCase = require('../usecases/users.usecase')
const auth = require('../middleware/auth.middleware')

const router = express.Router()

//GET /users

router.get('/', async (request, response) => {
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

//POST /users

router.post('/', async (request, response) => {
  try {
    const userCreated = await usersUseCase.create(request.body)

    response.json({
      success: true,
      data: { user: userCreated }
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
