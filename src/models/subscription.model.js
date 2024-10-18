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
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription