/* eslint-disable no-undef */
const express = require('express')
const registerUseCase = require('../usecases/register.usecase')

const router = express.Router()

//POST /register

router.post('/', async (request, response) => {
  try {
    const registerCreated = await registerUseCase.create(request.body)

    response.json({
      success: true,
      data: { user: registerCreated }
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
