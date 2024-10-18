/* eslint-disable no-undef */
// backend/routes/checkout.js
const express = require('express')
const router = express.Router()
const stripe = require('../config/stripeConfig') // Importa tu configuración de Stripe

// Endpoint para crear la sesión de Stripe Checkout
router.post('/', async (req, res) => {
  const { priceId } = req.body // Recibe el priceId del frontend

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, // Usa el priceId que recibes desde el frontend
          quantity: 1
        }
      ],
      mode: 'subscription', // O "payment" si es un pago único
      success_url: 'http://localhost:3000/ticketsDashboard', // URL de redirección en caso de éxito
      cancel_url: 'http://localhost:3000/Suscription' // URL de redirección en caso de cancelación
    })

    res.json({ id: session.id })
  } catch (error) {
    console.error('Error creando la sesión de pago:', error)
    res.status(500).send('Error al crear la sesión de pago')
  }
})

module.exports = router
