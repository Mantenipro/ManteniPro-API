/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { sendSupportEmail } = require('../usecases/sendSupportEmail.usecase')

router.post('/', async (request, response) => {
  const { name, email, message } = request.body
  console.log('Request body:', { name, email, message })

  try {
    const { ticketId } = await sendSupportEmail({ name, email, message })
    console.log('Email sent successfully, ticketId:', ticketId)
    response.status(200).json({ success: true, message: ticketId })
  } catch (error) {
    console.error('Error sending email:', error)
    response.status(error.status || 500).json({
      success: false,
      message: 'Error al enviar el mensaje'
    })
  }
})

module.exports = router