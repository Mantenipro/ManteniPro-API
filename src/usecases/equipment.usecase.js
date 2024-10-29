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

async function getEquipmentByUserId(userId) {
  try {
    const userEquipment = await Equipment.find({ company: userId });

    if (!userEquipment || userEquipment.length === 0) {
      throw createError(404, 'No equipment found for this user');
    }

    return userEquipment;
  } catch (error) {
    console.error('Error details:', error); 
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error retrieving user equipment');
    }
  }
}

async function editEquipment(id, updatedData) {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedEquipment) {
      throw createError(404, 'Equipment not found');
    }

    return updatedEquipment;
  } catch (error) {
    console.error('Error details:', error); 
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error updating equipment');
    }
  }
}

async function deleteEquipment(id) {
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(id);

    if (!deletedEquipment) {
      throw createError(404, 'Equipment not found');
    }

    return deletedEquipment;
  } catch (error) {
    console.error('Error details:', error); 
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error deleting equipment');
    }
  }
}

async function getAllEquipment() {
  try {
    const equipmentList = await Equipment.find();
    return equipmentList;
  } catch (error) {
    console.error('Error details:', error); 
    throw createError(500, 'Error retrieving equipment list');
  }
}

async function getEquipmentByCompanyId(companyId) {
  try {
    const equipment = await Equipment.find({ company: companyId });

    if (!equipment || equipment.length === 0) {
      throw createError(404, 'No equipment found for this company');
    }

    return equipment;
  } catch (error) {
    console.error('Error details:', error); 
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error retrieving equipment by company');
    }
  }
}

module.exports = {
  createEquipment,
  editEquipment,
  deleteEquipment,
  getAllEquipment,
  getEquipmentByCompanyId,
  getEquipmentByUserId 
};






