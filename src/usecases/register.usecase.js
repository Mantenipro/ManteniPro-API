/* eslint-disable no-undef */
const register = require('../models/formRegister');
const encrypt = require('../lib/encrypt');
const createError = require('http-errors');

async function create(userData) {
  const registerFound = await register.findOne({ email: userData.email });

  if (registerFound) {
    throw createError(409, 'Email already in use');
  }

  userData.password = await encrypt.encrypt(userData.password);

  const newRegister = await register.create(userData);
  return newRegister;
}

async function getAll() {
  try {
    const allRegisters = await register.find();
    return allRegisters;
  } catch (error) {
    throw createError(500, 'Error retrieving data');
  }
}

async function getById(id) {
  try {
    const registerById = await register.findById(id);
    if (!registerById) {
      throw createError(404, 'Register not found');
    }
    return registerById;
  } catch (error) {
    throw createError(500, 'Error retrieving register');
  }
}

async function deleteById(id) {
  try {
    const deletedRegister = await register.findByIdAndDelete(id);
    if (!deletedRegister) {
      throw createError(404, 'Register not found');
    }
    return deletedRegister;
  } catch (error) {
    throw createError(500, 'Error deleting register');
  }
}

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
};

