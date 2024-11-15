/* eslint-disable no-undef */
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  assignedTo: {
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
  },
  solution: {
    type: String,
    required: false // No es obligatorio
  },
  finishedAt: {
    type: Date,
    required: false // No es obligatorio
  },
  VaBo: {
    type: String,
    required: false // No es obligatorio
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
