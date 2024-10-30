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
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  owner: {
    type: String,
    required: true,
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
    type: String,
    default: null,
  },
  qr: {
    type: String,
    default: null,
    trim: true,
  },
}, {
  timestamps: true // Esto agregará createdAt y updatedAt automáticamente
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;



