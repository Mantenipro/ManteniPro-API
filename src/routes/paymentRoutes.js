/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const stripe = require('../config/stripeConfig')

router.post('/', async (request, response) => {
  const { plan } = request.body

  console.log('Request body:', request.body) // Verificar el cuerpo de la solicitud

  const plans = {
    basic: {
      amount: 999, // $9.99 in cents
      currency: 'usd'
    },
    premium: {
      amount: 1999, // $19.99 in cents
      currency: 'usd'
    }
  }

  console.log('Selected plan:', plan) // Verificar el plan seleccionado
  console.log('Plan details:', plans[plan]) // Verificar los detalles del plan

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plans[plan].amount,
      currency: plans[plan].currency
    })

    console.log('PaymentIntent created:', paymentIntent) // Verificar la respuesta del paymentIntent

    response.status(200).send({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.log('Error creating PaymentIntent:', error) // Capturar y mostrar errores
    response.status(error).send({
      error: error.raw.message
    })
  }
})

module.exports = router