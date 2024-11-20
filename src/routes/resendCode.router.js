/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { resendActivationCode } = require('../usecases/resendCode.usecase')

// Ruta para reenvío de código de activación
router.post('/', async (req, res) => {
  try {
    const { email } = req.body
    const result = await resendActivationCode(email)
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router