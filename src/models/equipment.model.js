const mongoose = require('mongoose');

// Define el esquema para equipos
const equipmentSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Se cambia 'user' a 'User' para que coincida con el nombre del modelo
  },
  manufactureDate: {
    type: Date,
    required: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  unitType: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL o nombre del archivo
    default: null,
  },
  qr: {
    type: String, // Puede ser una URL o el código QR en formato base64
    default: null,
    trim: true, // Se incluye trim para eliminar espacios accidentales
  },
});

// Crear y exportar el modelo
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;


