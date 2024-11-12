/* eslint-disable no-undef */
const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil', // Asegúrate de que el nombre del modelo de usuario sea correcto
    required: true
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reports', // Asegúrate de que el nombre del modelo de reporte sea correcto
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
})

const Assignment = mongoose.model('Assignment', assignmentSchema)
module.exports = Assignment



