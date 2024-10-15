/* eslint-disable no-undef */
const user = require('../models/user.created.perfil') // Modelo de usuario
const Company = require('../models/companies.model') // Modelo de empresa
const encrypt = require('../lib/encrypt') // Librería para encriptar
const createError = require('http-errors') // Manejo de errores

// Función para crear un nuevo usuario
async function create(userData) {
  try {
    // Verificar si el correo ya está en uso
    const userFound = await user.findOne({ email: userData.email })


    if (userFound) {
      // Si el correo ya existe, lanzamos un error
      throw createError(409, 'Email already in use')
    }

    // Encriptar la contraseña antes de guardarla
    userData.password = await encrypt.encrypt(userData.password)

    // Verificar si se proporciona un companyId y si la empresa existe
    if (userData.company) {
      console.log('Company ID provided:', userData.company) // Mensaje de consola para depuración
      const companyFound = await Company.findById(userData.company)

      if (!companyFound) {
        // Si la empresa no se encuentra, lanzamos un error
        console.error('Company not found for ID:', userData.company) // Mensaje de consola para depuración
        throw createError(404, 'Company not found')
      }

      // Asignar el ObjectId de la empresa al campo company del usuario
      userData.company = companyFound._id
    }

    // Crear el nuevo usuario con los datos proporcionados
    const newUser = await user.create(userData)

    // Si el usuario tiene una empresa asociada, usamos populate para incluir toda la información de la empresa
    if (newUser.company) {
      await newUser.populate('company').execPopulate() // Asegura que se ejecute el populate correctamente
    }

    // Retornamos el nuevo usuario, incluyendo la información de la empresa si fue populada
    console.log('data:', newUser)
    return newUser
  } catch (error) {
    // Si ocurre un error, lo manejamos y lo lanzamos para que sea capturado externamente
    throw createError(500, error.message)
  }
}

// Función para obtener un usuario por ID
async function getById(userId) {
  try {
    const userFound = await user.findById(userId).populate('company')

    if (!userFound) {
      throw createError(404, 'User not found')
    }

    return userFound
  } catch (error) {
    throw createError(500, error.message)
  }
}

module.exports = {
  create,
  getById
}
