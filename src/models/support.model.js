/* eslint-disable no-undef */
const mongoose = require('mongoose')

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const SupportTT = mongoose.model('supportTicket', supportTicketSchema)
module.exports = SupportTT
