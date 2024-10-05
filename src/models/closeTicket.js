/* eslint-disable no-undef */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tickets'
  },
  solution: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  clientApproval: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('closeTicket', schema)