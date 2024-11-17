/* eslint-disable no-undef */
const Equipment = require('../models/equipment.model')
const createError = require('http-errors')

async function createEquipment(
  equipmentName,
  model,
  manufactureDate,
  brand,
  location,
  unitType,
  image,
  qr,
  userId,
  owner
) {
  try {
    if (!image) {
      console.warn('Image field is missing or invalid');
    }

    // Construir el objeto solo con los campos definidos
    const equipmentData = {
      equipmentName,
      model,
      company: userId,
      owner,
      brand,
      location,
      unitType,
      image,
      qr,
    };

    // Agregar manufactureDate solo si existe
    if (manufactureDate) {
      equipmentData.manufactureDate = manufactureDate;
    }

    const newEquipment = await Equipment.create(equipmentData);

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
    const userEquipment = await Equipment.find({ company: userId })

    if (!userEquipment || userEquipment.length === 0) {
      throw createError(404, 'No equipment found for this user')
    }

    return userEquipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error retrieving user equipment')
    }
  }
}

async function editEquipment(id, updatedData) {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    )

    if (!updatedEquipment) {
      throw createError(404, 'Equipment not found')
    }

    return updatedEquipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error updating equipment')
    }
  }
}

async function deleteEquipment(id) {
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(id)

    if (!deletedEquipment) {
      throw createError(404, 'Equipment not found')
    }

    return deletedEquipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error deleting equipment')
    }
  }
}

async function getAllEquipment() {
  try {
    const equipmentList = await Equipment.find()
    return equipmentList
  } catch (error) {
    console.error('Error details:', error)
    throw createError(500, 'Error retrieving equipment list')
  }
}

async function getEquipmentByCompanyId(companyId) {
  try {
    const equipment = await Equipment.find({ company: companyId })

    if (!equipment || equipment.length === 0) {
      throw createError(404, 'No equipment found for this company')
    }

    return equipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error retrieving equipment by company')
    }
  }
}

async function getEquipmentById(equipmentId) {
  try {
    const equipment = await Equipment.findById(equipmentId)

    if (!equipment) {
      throw createError(404, 'Equipment not found')
    }

    return equipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error retrieving equipment by ID')
    }
  }
}



async function getEquipmentByOwner(ownerId) {
  try {
    const equipmentByOwner = await Equipment.find({ owner: ownerId });

    if (!equipmentByOwner || equipmentByOwner.length === 0) {
      throw createError(404, 'No equipment found for this owner');
    }

    return equipmentByOwner;
  } catch (error) {
    console.error('Error details:', error);
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error retrieving equipment by owner');
    }
  }
}


module.exports = {
  createEquipment,
  editEquipment,
  deleteEquipment,
  getAllEquipment,
  getEquipmentByCompanyId,
  getEquipmentByUserId,
  getEquipmentById,
  getEquipmentByOwner 
};
