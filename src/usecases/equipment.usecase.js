/* eslint-disable no-undef */
const Equipment = require('../models/equipment.model');
const createError = require('http-errors');

async function createEquipment(equipmentData) {
  // Verifica si ya existe un equipo con el mismo nombre y modelo
  const equipmentFound = await Equipment.findOne({
    equipmentName: equipmentData.equipmentName,
    model: equipmentData.model
  });

  if (equipmentFound) {
    // Si ya existe un equipo con el mismo nombre y modelo, lanza un error 409
    throw createError(409, 'Equipment with the same name and model already exists');
  }

  // Crea un nuevo equipo
  const newEquipment = await Equipment.create(equipmentData);
  
  return newEquipment;
}

module.exports = {
  createEquipment
};
