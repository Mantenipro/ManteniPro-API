/* eslint-disable no-undef */
const Ticket = require('../models/report.model')
const Subscription = require('../models/subscription.model')

async function canCreateTicket(userId) {
  const subscription = await Subscription.findOne({ userId: userId })
  if (!subscription) {
    throw new Error('No subscription found for user')
  }

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const ticketCount = await Ticket.countDocuments({
    userId: userId,
    createdAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1)
    }
  })

  if (subscription.productId === 'prod_R023GfgtRfPNC7' && ticketCount >= 10) {
    return false
  } else if (
    subscription.productId === 'prod_R024q1v8rr1odd' &&
    ticketCount >= 100
  ) {
    return false
  }
  return true
}

module.exports = {
  canCreateTicket
}
