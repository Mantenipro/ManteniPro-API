/* eslint-disable no-undef */
const createError = require('http-errors') // Manejo de errores
const user = require('../models/user.created.perfil') // Modelo de usuario
const Company = require('../models/companies.model') // Modelo de empresa
const encrypt = require('../lib/encrypt') // Librería para encriptar
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { createTransporter } = require('../utils/mailUtils')
const {
  generateActivationCode,
  hashActivationCode
} = require('../utils/tokenUtils')

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
    // Busca al usuario sin poblar la compañía aún
    const userFound = await user.findById(userId)

    if (!userFound) {
      throw createError(404, 'User not found')
    }

    // Dependiendo del rol, pobla solo el nombre de la empresa o toda la información
    if (userFound.role === 'admin') {
      // Para los administradores, pobla toda la información de la compañía
      await userFound.populate('company')
    } else if (userFound.role === 'usuario' || userFound.role === 'tecnico') {
      // Para usuarios y técnicos, solo pobla el campo 'name' de la empresa
      await userFound.populate({
        path: 'company',
        select: 'name' // Solo selecciona el nombre
      })
    }

    return userFound
  } catch (error) {
    throw createError(500, error.message)
  }
}

// Función para crear usuarios
async function createUsers(userData, creatorId) {
  try {
    // Verificar si el correo ya está en uso
    const userFound = await user.findOne({ email: userData.email })
    if (userFound) {
      throw createError(409, 'Email already in use')
    }

    // Obtener el creador (administrador)
    const creator = await user.findById(creatorId)
    if (!creator || creator.role !== 'admin') {
      throw createError(403, 'Access denied')
    }

    // Obtener la compañía del administrador
    const company = await Company.findById(creator.company)
    if (!company) {
      throw createError(404, 'Company not found')
    }

    // Encriptar la contraseña
    const hashedPassword = await encrypt.encrypt(userData.password)

    // Generar un código de activación
    const activationCode = generateActivationCode()

    // Generar el token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    const activationLink = `http://localhost:3000/activate?token=${token}`
    const transporter = await createTransporter()
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userData.email,
      subject: 'Activación de tu cuenta',
      html: `<p>Tu código de activación es: ${activationCode} Tienes una hora para activarla.</p> 
             <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta: <a href="${activationLink}">Activar Cuenta. </a></p>`
    }

    await transporter.sendMail(mailOptions)

    // Crear el nuevo usuario
    const newUser = new user({
      ...userData,
      password: hashedPassword, // Usar la contraseña encriptada
      company: company._id, // Asociar el usuario a la compañía del administrador
      activationCodeHash: await hashActivationCode(activationCode),
      activationCodeExpiration: moment().add(1, 'hours').toDate()
    })

    // Guardar el nuevo usuario en la base de datos
    await newUser.save()

    return newUser
  } catch (error) {
    throw createError(500, error.message);
  }
}

//Funcion para buscar los usuarios creados
async function getUsersByCompany(companyId) {
  try {
    const users = await user.find({ company: companyId })
    console.log('Users found:', users) // Agrega esto para verificar los usuarios encontrados
    return users
  } catch (error) {
    throw createError(500, error.message)
  }
}

module.exports = {
  create,
  getById,
  createUsers,
  getUsersByCompany
}
