const mongoose = require('mongoose');

// Define the schema for equipment
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
    ref: 'user', // Reference to the 'user' model
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
    type: String, // URL or file name
    default: null,
  },
});

// Create and export the model
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
