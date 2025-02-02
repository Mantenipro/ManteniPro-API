/* eslint-disable no-undef */
const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  stripeSubscriptionId: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String
  },
  currentPeriodStart: {
    type: Date
  },
  currentPeriodEnd: {
    type: Date
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false // Valor por defecto
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  productId: {
    type: String
  },
  features: [
    {
      name: String,
      description: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }
  ],
  hasReachedTicketLimit: {
    type: Boolean,
    default: false
  }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription