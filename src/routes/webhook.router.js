/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const stripe = require('../config/stripeConfig')
const router = express.Router()
require('dotenv').config()

const User = require('../models/user.model')
const Subscription = require('../models/subscription.model')
const Company = require('../models/companies.model') // Importamos el modelo de Company

// Función de retraso
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Aplica bodyParser.raw SOLO en la ruta del webhook
router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
      // Utiliza req.body directamente como Buffer sin modificar
      event = stripe.webhooks.constructEvent(
        req.body, // Asegúrate de pasar el cuerpo en bruto
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.sendStatus(400)
    }

    // Manejar los eventos relevantes
    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object

        try {
          // Procesar el evento de creación de cliente
          await handleCustomerCreated(customer)
        } catch (error) {
          console.error('Error processing customer.created:', error)
        }

        break
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object

        try {
          // Procesar el evento de creación de suscripción
          await saveSubscription(subscription.customer, subscription)
        } catch (error) {
          console.error(
            'Error processing customer.subscription.created:',
            error
          )
        }

        break
      }
      default:
      // Otros tipos de eventos no manejados
    }
    // Devolver una respuesta 200 para confirmar la recepción del evento
    res.sendStatus(200)
  }
)

// Función para manejar el evento customer.created
async function handleCustomerCreated(customer) {
  try {
    console.log('Handling customer.created for email:', customer.email)

    // Buscar la compañía usando el correo del cliente en el evento customer.created
    const company = await Company.findOne({ email: customer.email })
    if (!company) {
      console.log('Company not found, skipping user creation...')
      return
    }

    console.log('Company found:', company)

    // Crear un nuevo usuario con la referencia de la compañía
    let user = await User.findOne({ stripeCustomerId: customer.id })
    if (!user) {
      user = new User({
        name: customer.name || company.name, // Asigna nombre si está disponible
        email: customer.email,
        stripeCustomerId: customer.id,
        companyId: company._id // Referencia a la compañía
      })

      await user.save()
      console.log('New user created:', user)

      // Actualizar el campo stripeCustomerId en la compañía
      company.stripeCustomerId = customer.id
      await company.save()
      console.log('Company updated with stripeCustomerId:', customer.id)
    } else {
      console.log('User already exists with stripeCustomerId:', customer.id)
    }
  } catch (error) {
    console.error('Error handling customer.created:', error)
  }
}

// Función para guardar la información de la suscripción
async function saveSubscription(customerId, subscriptionData) {
  try {
    console.log('Searching for user with stripeCustomerId:', customerId)

    // Buscar el usuario en la base de datos de User
    let user = await User.findOne({ stripeCustomerId: customerId })
    if (!user) {
      console.log('User not found, waiting for user creation...')
      await delay(2000) // Esperar 2 segundos antes de volver a intentar
      user = await User.findOne({ stripeCustomerId: customerId })
      if (!user) {
        console.log('User still not found, skipping subscription update...')
        return
      }
    }

    // Buscar la compañía asociada al usuario
    const company = await Company.findById(user.companyId)
    if (!company) {
      console.log('Company not found, skipping subscription update...')
      return
    }

    // Convertir Unix timestamp a Date
    const currentPeriodStart = new Date(
      subscriptionData.current_period_start * 1000
    )
    const currentPeriodEnd = new Date(
      subscriptionData.current_period_end * 1000
    )

    // Crear una nueva suscripción
    console.log('Creating new subscription...')
    const subscription = new Subscription({
      userId: user._id,
      stripeSubscriptionId: subscriptionData.id,
      status: subscriptionData.plan.active,
      currentPeriodStart: currentPeriodStart,
      currentPeriodEnd: currentPeriodEnd,
      companyId: company._id // Referencia a la compañía
    })

    // Guardar la suscripción en la base de datos
    await subscription.save()
    console.log('Subscription saved:', subscription)

    // Actualizar el documento de Company con el ID de la suscripción
    company.subscription_type = subscription._id
    company.isActive = true // Actualiza el estatus a activo
    await company.save()
    console.log(
      'Company updated with subscription ID and status:',
      subscription._id
    )
    console.log('Subscription saved successfully')
  } catch (error) {
    console.error('Error saving subscription:', error)
  }
}

module.exports = router
