const Equipment = require('../models/equipment.model');
const createError = require('http-errors');

async function createEquipment(equipmentName, model, manufactureDate, brand, location, unitType, image, qr, userId) {
  try {
    // Verifica si ya existe un equipo con el mismo nombre y modelo
    const equipmentFound = await Equipment.findOne({
      equipmentName: equipmentName,
      model: model
    });

    if (equipmentFound) {
      // Si ya existe un equipo con el mismo nombre y modelo, lanza un error 409
      throw createError(409, 'Equipment with the same name and model already exists');
    }

    // Log para ver los datos antes de crear el equipo
    console.log('Creating new equipment with data:', {
      equipmentName,
      model,
      owner: userId, // Se cambia 'owner' por 'userId'
      manufactureDate,
      brand,
      location,
      unitType,
      image,
      qr
    });

    // Verifica que los datos de la imagen no sean null o undefined
    if (!image) {
      console.warn('Image field is missing or invalid');
    }

    // Crea un nuevo equipo
    const newEquipment = await Equipment.create({
      equipmentName,
      model,
      owner: userId, // Se asigna el userId como owner
      manufactureDate,
      brand,
      location,
      unitType,
      image, // Se incluye la propiedad image
      qr     // Se incluye la propiedad qr
    });

    return newEquipment;
  } catch (error) {
    console.error('Error details:', error); // Log para obtener detalles del error
    if (error.status) {
      throw error; // Lanzar el error si ya tiene un status code (como 409)
    } else {
      throw createError(500, 'Error creating equipment');
    }
  }
}

module.exports = {
  createEquipment
};



