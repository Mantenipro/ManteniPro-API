/* eslint-disable no-undef */
const Equipment = require('../models/equipment.model');
const createError = require('http-errors');
const Company = require('../models/companies.model');
const user = require('../models/user.created.perfil');

async function createEquipment(userData, creatorId) {
  try {
    const equipmentFound = await Equipment.findOne({
      equipmentName: userData.equipmentName,
      model: userData.model
    }) 
    if (equipmentFound) {
      throw createError(
        409,
        'Equipment with the same name and model already exists'
      )
    }
    const creator = await user.findById(creatorId)
    if(!creator){
      throw createError(404, 'User not found')
    }

    const company = await Company.findById(creator.company)
    if(!company){
      throw createError(404, 'Company not found')
    }

    const newEquipment = new Equipment({
      ...userData,
      company: company._id
     })

     await newEquipment.save()

    return newEquipment
  } catch (error) {
    console.error('Error details:', error)
    if (error.status) {
      throw error
    } else {
      throw createError(500, 'Error creating equipment')
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

async function deleteEquipment(userId) {
  if (!userId) {
    throw createError(400, 'Invalid input')
  }
  try {
    const equipmentDeleted = await Equipment.findByIdAndDelete(userId)
    if (!equipmentDeleted) {
      throw createError(404, 'Equipment not found')
    }

    return equipmentDeleted
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
    const equipmentList = await Equipment.find();
    return equipmentList;
  } catch (error) {
    console.error('Error details:', error); 
    throw createError(500, 'Error retrieving equipment list');
  }
}

async function getEquipmentByCompany(companyId) {
  try {
    const equipment = await Equipment.find({ company: companyId });

    if (!equipment || equipment.length === 0) {
      throw createError(404, 'No equipment found for this company');
    }
    console.log(equipment)

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

async function updateEquiment(equipmentId, equipmentData) {
  if (!equipmentId || !equipmentData) {
    console.error('Invalid input:', { equipmentId, equipmentData }) // Agregar para depuración
    throw createError(400, 'Invalid input')
  }

  try {
    const equipmentFound = await Equipment.findById(equipmentId);
    if (!equipmentFound) {
      throw createError(404, 'Equipment not found');
    }

    const allowedUpdates = ['equipmentName', 'model', 'manufactureDate', 'brand', 'location', 'unitType', 'image', 'qr'];
    const updates = Object.keys(equipmentData).filter(key => allowedUpdates.includes(key));

    updates.forEach(key => {
      equipmentFound[key] = equipmentData[key];
    });

    const updatedEquipment = await equipmentFound.save();

    return updatedEquipment;
  } catch (error) {
    console.error('Error updating equipment:', error);
    if (error.status) {
      throw error;
    }
    throw createError(500, 'Error updating equipment');
  }
}

async function getById(equipmentId) {
  try {
    
    const equipmentFound = await Equipment.findById(equipmentId);

    if (!equipmentFound) {
      throw createError(404, 'Equipment not found');
    }

    await equipmentFound.populate({
      path: 'company',
      select: 'name' // Solo selecciona el nombre
    })
    return equipmentFound
  } catch (error) {
    throw createError(500, error.message);
  }
 }

async function getEquipmentById(equipmentId) {
  try {
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      throw createError(404, 'Equipment not found');
    }

    return equipment;
  } catch (error) {
    console.error('Error details:', error);
    if (error.status) {
      throw error;
    } else {
      throw createError(500, 'Error retrieving equipment by ID');
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
};






