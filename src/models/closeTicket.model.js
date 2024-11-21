/* eslint-disable no-undef */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reports',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil',
    required: true
  },
  assignedAt: {
    type: Date,
    required: true
  },
  solution: {
    type: String
  },
  endDate: {
    type: Date
  },
  clientApproval: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('closeTicket', schema)