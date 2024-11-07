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
  plan: {
    type: String,
    enum: ['basic_plan', 'premium_plan'],
    required: true
  }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription