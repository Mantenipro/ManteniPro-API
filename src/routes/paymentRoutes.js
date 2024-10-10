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
    console.error('Error creating PaymentIntent:', error) // Capturar y mostrar errores
    if (error.type) {
      switch (error.type) {
        case 'StripeCardError':
          // Error con la tarjeta
          response.status(400).send({
            error: {
              message: error.message,
              type: error.type,
              code: error.code,
              param: error.param
            }
          })
          break
        case 'StripeRateLimitError':
          // Demasiadas solicitudes a la API
          response.status(429).send({
            error: {
              message: 'Too many requests made to the API too quickly.',
              type: error.type
            }
          })
          break
        case 'StripeInvalidRequestError':
          // Parámetros inválidos
          response.status(400).send({
            error: {
              message: error.message,
              type: error.type,
              param: error.param
            }
          })
          break
        case 'StripeAPIError':
          // Error interno de Stripe
          response.status(500).send({
            error: {
              message: 'An error occurred internally with Stripe.',
              type: error.type
            }
          })
          break
        case 'StripeConnectionError':
          // Error de red
          response.status(502).send({
            error: {
              message: 'Network communication with Stripe failed.',
              type: error.type
            }
          })
          break
        case 'StripeAuthenticationError':
          // Error de autenticación
          response.status(401).send({
            error: {
              message: "Authentication with Stripe's API failed.",
              type: error.type
            }
          })
          break
        default:
          // Otros errores
          response.status(500).send({
            error: {
              message: 'An unexpected error occurred.',
              type: error.type
            }
          })
          break
      }
    } else {
      // Manejar otros tipos de errores
      response.status(500).send({
        error: {
          message: 'An unexpected error occurred.',
          details: error.message
        }
      })
    }
  }
})

module.exports = router