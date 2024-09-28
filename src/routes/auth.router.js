/* eslint-disable no-undef */
const express = require('express')

const authUseCase = require('../usecases/auth.usecase')

const router = express.Router()

// POST /auth/login

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body
    const token = await authUseCase.login(email, password)
    response.json({
      success: true,
      data: { token }
    })
  } catch (error) {
    response.status(error.status || 401)
    response.json({
      success: false,
      error: error.message
    })
  }
})

module.exports = router
