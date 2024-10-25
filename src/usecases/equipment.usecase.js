const Equipment = require('../models/equipment.model');
const createError = require('http-errors');

async function createEquipment(equipmentName, model, manufactureDate, brand, location, unitType, image, qr, userId, owner) {
  try {
    const equipmentFound = await Equipment.findOne({
      equipmentName: equipmentName,
      model: model
    });

    if (equipmentFound) {
      throw createError(409, 'Equipment with the same name and model already exists');
    }

    if (!image) {
      console.warn('Image field is missing or invalid');
    }

    const newEquipment = await Equipment.create({
      equipmentName,
      model,
      company: userId, 
      owner, 
      manufactureDate,
      brand,
      location,
      unitType,
      image, 
      qr     
    });

    return newEquipment;
  } catch (error) {
    console.error('Error details:', error); 
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error creating equipment');
    }
  }
}

module.exports = {
  createEquipment
};




