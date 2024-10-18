/* eslint-disable no-undef */
// suspendSubscription.js
const express = require('express')
const router = express.Router()
const stripe = require('../config/stripeConfig') // Importa la configuración de Stripe
const Subscription = require('../models/subscription.model') // Importa tu modelo de Subscription

router.post('/', async (req, res) => {
  const { subscriptionId } = req.body

  // Verificar si subscriptionId está presente
  if (!subscriptionId) {
    console.log('Subscription ID is missing')
    return res.status(400).json({ error: 'Subscription ID is required' })
  }

  console.log('Attempting to suspend subscription with ID:', subscriptionId)

  try {
    // Suspender la suscripción con stripe.subscriptions.update
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })
    console.log('Subscription suspended successfully:', subscription)

    // Si la suscripción se suspende correctamente, actualiza la base de datos
    if (subscription.cancel_at_period_end) {
      console.log(
        'Subscription is set to cancel at period end, updating database'
      )

      // Buscar la suscripción con el ID de la suscripción y popular la referencia a la compañía
      const subscriptionDoc = await Subscription.findOne({
        stripeSubscriptionId: subscriptionId
      })
        .populate('companyId') // Populate para traer la referencia a la compañía
        .exec()

      console.log('Subscription document found:', subscriptionDoc)

      if (!subscriptionDoc) {
        console.log(
          'Subscription not found for subscription ID:',
          subscriptionId
        )
        return res.status(404).json({ error: 'Subscription not found' })
      }

      const company = subscriptionDoc.companyId

      console.log('Company found:', company)

      if (!company) {
        console.log('Company not found for subscription ID:', subscriptionId)
        return res.status(404).json({ error: 'Company not found' })
      }

      // Actualizar los campos relacionados con la suscripción
      company.isActive = false

      // Guardar la compañía con los datos actualizados
      await company.save()

      console.log('Company subscription status updated in the database')

      return res.status(200).json({
        message: 'Subscription suspended and database updated successfully'
      })
    } else {
      // Si la suscripción no está realmente suspendida
      console.log(
        'Subscription is not set to cancel at period end:',
        subscription.cancel_at_period_end
      )
      return res
        .status(400)
        .json({ error: 'Subscription is not set to cancel at period end' })
    }
  } catch (error) {
    console.error('Error suspending subscription:', error)

    // Enviar un mensaje de error detallado
    return res.status(500).json({
      error: 'Failed to suspend subscription',
      message: error.message
    })
  }
})

module.exports = router
