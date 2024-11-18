/* eslint-disable no-undef */
const Ticket = require('../models/report.model')
const Subscription = require('../models/subscription.model')
const User = require('../models/user.created.perfil') // Asegúrate de importar el modelo de User

async function canCreateTicket(userId) {
  console.log(`Verificando tickets para el usuario con ID: ${userId}`)

  // Obtener el usuario completo con la referencia a la compañía
  const userAdmin = await User.findById(userId).populate('company')
  if (!userAdmin || !userAdmin.company) {
    throw new Error('No user found for company')
  }

  const companyId = userAdmin.company._id
  console.log(`ID de la compañía obtenida: ${companyId}`)

  // Buscar la suscripción asociada a la compañía
  const subscription = await Subscription.findOne({ companyId: companyId })
  if (!subscription) {
    throw new Error(`No subscription found for company with ID: ${companyId}`)
  }
  console.log(`Suscripción encontrada: ${subscription}`)

  // Obtener el mes y año actuales
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  console.log(`Mes y año actuales: ${currentMonth + 1}/${currentYear}`)

  // Contar el número de tickets creados este mes para la compañía
  const ticketCount = await Ticket.countDocuments({
    company: userId,
    created_at: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1)
    }
  })
  console.log(`Número de tickets creados este mes: ${ticketCount}`)

  // Verificar el límite de tickets según el productId de la suscripción
  let hasReachedLimit = false
  if (subscription.productId === 'prod_R023GfgtRfPNC7' && ticketCount >= 10) {
    console.log(
      'Límite de 10 tickets alcanzado para el producto prod_R023GfgtRfPNC7'
    )
    hasReachedLimit = true
  } else if (
    subscription.productId === 'prod_R024q1v8rr1odd' &&
    ticketCount >= 100
  ) {
    console.log(
      'Límite de 100 tickets alcanzado para el producto prod_R024q1v8rr1odd'
    )
    hasReachedLimit = true
  }

  // Actualizar la propiedad hasReachedTicketLimit del usuario administrador
  subscription.hasReachedTicketLimit = hasReachedLimit
  await subscription.save()

  if (hasReachedLimit) {
    return false
  }

  console.log('Límite de tickets no alcanzado')
  return true
}

module.exports = {
  canCreateTicket
}
