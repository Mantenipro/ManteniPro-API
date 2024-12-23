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
      const companyFound = await Company.findById(userData.company)

      if (!companyFound) {
        // Si la empresa no se encuentra, lanzamos un error
        //console.error('Company not found for ID:', userData.company) // Mensaje de consola para depuración
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
    const company = await Company.findById(creator.company).populate(
      'subscription_type'
    )

    if (!company) {
      throw createError(404, 'Company not found')
    }

    // Contar el número de administradores actuales
    const adminCount = await user.countDocuments({
      company: creator.company,
      role: 'admin'
    })

    if (userData.role === 'admin') {
      if (
        company.subscription_type.productId === 'prod_R023GfgtRfPNC7' &&
        adminCount >= 1
      ) {
        throw createError(
          403,
          'Las cuentas básicas solo pueden tener un administrador.'
        )
      }

      if (
        company.subscription_type.productId === 'prod_R024q1v8rr1odd' &&
        adminCount >= 2
      ) {
        throw createError(
          403,
          'Las cuentas premium solo pueden tener dos administradores.'
        )
      }
    }

    // Encriptar la contraseña
    const hashedPassword = await encrypt.encrypt(userData.password)

    // Generar un código de activación
    const activationCode = generateActivationCode()

    // Crear el objeto de datos del nuevo usuario
    const newUserData = {
      ...userData,
      password: hashedPassword, // Usar la contraseña encriptada
      company: company._id, // Asociar el usuario a la compañía del administrador
      activationCodeHash: await hashActivationCode(activationCode),
      activationCodeExpiration: moment().add(1, 'hours').toDate()
    }

    // Agregar propiedades específicas para administradores
    if (userData.role === 'admin') {
      newUserData.formRegister = creator.formRegister // Asociar el formulario de registro del administrador
      newUserData.adminType = 'secundario' // Asignar el tipo de administrador
      newUserData.accountStatus = true // Activar la cuenta automáticamente
    }

    // Crear el nuevo usuario
    const newUser = new user(newUserData)

    // Guardar el nuevo usuario en la base de datos
    await newUser.save()

    // Generar el token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    const activationLink = `https://www.mantenipro.net/userActivate?token=${token}`

    const transporter = await createTransporter()
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userData.email,
      subject: 'Activación de tu cuenta',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f9;
            }
            .outer-table {
              width: 100%;
              background-color: #232c48;
              padding: 40px 20px;
              text-align: center;
            }
            .inner-table {
              background-color: #ffffff;
              color: #333;
              border-radius: 8px;
              padding: 30px;
              width: 80%;
              max-width: 600px;
              margin: 0 auto;
              position: relative;
            }
            h1 {
              font-size: 24px;
              color: #4361b2;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              margin-bottom: 15px;
              line-height: 1.5;
            }
            .highlight {
              font-weight: bold;
              color: #4361b2;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #777;
            }
            .logo {
              position: absolute;
              bottom: 20px;
              right: 20px;
              max-width: 100px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;

              color: #ffffff; 
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
           
          </style>
        </head>
        <body>
          <table class="outer-table" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <table class="inner-table" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <h1>Activación de tu cuenta</h1>
                      <p>Tu código de activación es:</p>
                      <p class="highlight">${activationCode}</p>
                      <p>Tienes <span class="highlight">1 hora</span> para activarla.</p>
                      <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>
                      <a href="${activationLink}" class="button">Activar Cuenta</a>
                      <p class="footer">Si no solicitaste esta activación, ignora este correo.</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="https://mantenipro.s3.us-east-2.amazonaws.com/logo.png" alt="Mantenipro Logo" class="logo">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions)

    return newUser
  } catch (error) {
    throw createError(500, error.message)
  }
}

//Funcion para buscar los usuarios creados
async function getUsersByCompany(companyId) {
  try {
    const users = await user.find({ company: companyId })
    return users
  } catch (error) {
    throw createError(500, error.message)
  }
}

// Función para obtener todos los usuarios
async function getAllUsers() {
  try {
    const users = await user.find() // Busca todos los usuarios en la base de datos
    return users // Retorna la lista de usuarios
  } catch (error) {
    throw createError(500, error.message) // Manejo de errores
  }
}

// Función para modificar un usuario
// Función para modificar un usuario
async function updateUser(userId, userData) {
  if (!userId || !userData) {
    throw createError(400, 'Invalid input');
  }

  try {
    const userFound = await user.findById(userId);
    if (!userFound) {
      throw createError(404, 'User not found');
    }

    // Filtrar los datos permitidos, agregando 'photo' a la lista
    const allowedUpdates = ['name', 'role', 'type', 'photo'];
    const updates = Object.keys(userData).filter((key) =>
      allowedUpdates.includes(key)
    );

    // Verificar si el rol se está actualizando a 'admin'
    if (updates.includes('role') && userData.role === 'admin') {
      const creator = await user.findById(userFound.creator);
      if (!creator) {
        throw createError(403, 'Access denied');
      }

      const company = await Company.findById(creator.company).populate(
        'subscription_type'
      );
      if (!company) {
        throw createError(404, 'Company not found');
      }

      const adminCount = await user.countDocuments({
        company: creator.company,
        role: 'admin',
      });

      // Verificar el plan de suscripción y limitar los administradores
      if (
        company.subscription_type.productId === 'prod_R023GfgtRfPNC7' &&
        adminCount >= 1
      ) {
        throw createError(
          403,
          'Las cuentas básicas solo pueden tener un administrador.'
        );
      }

      if (
        company.subscription_type.productId === 'prod_R024q1v8rr1odd' &&
        adminCount >= 2
      ) {
        throw createError(
          403,
          'Las cuentas premium solo pueden tener dos administradores.'
        );
      }
    }

    // Actualizar los datos del usuario
    updates.forEach((key) => {
      userFound[key] = userData[key];
    });

    // Guardar los cambios
    const updatedUser = await userFound.save();

    return updatedUser;
  } catch (error) {
    //console.error('Error en updateUser:', error); // Registrar el error completo
    if (error.status) {
      throw error;
    }
    throw createError(500, 'Error updating user');
  }
}


//Eliminar un usuario
async function deleteUser(userId) {
  if (!userId) {
    throw createError(400, 'Invalid input')
  }

  try {
    const userDeleted = await user.findByIdAndDelete(userId)
    if (!userDeleted) {
      throw createError(404, 'User not found')
    }

    return userDeleted
  } catch (error) {
    //console.error('Error en deleteUser:', error) // Registrar el error completo
    if (error.status) {
      throw error
    }
    throw createError(500, 'Error deleting user')
  }
}

async function unlockUser(email) {
  if (!email) {
    throw createError(400, 'Invalid input')
  }

  try {
    const userFound = await user.findOne({ email: email })
    if (!userFound) {
      throw createError(404, 'User not found')
    }
    // Establecer la contraseña por defecto y hashearla
    const defaultPassword = 'Pa$$w0rd!'
    const hashedPassword = await encrypt.encrypt(defaultPassword)
    userFound.password = hashedPassword
    userFound.mustChangePassword = true
    userFound.unlockRequested = false
    userFound.isLocked = false
    userFound.failedLoginAttempts = 0
    await userFound.save()
  } catch (error) {
    //console.error('Error en unlockUser:', error) // Registrar el error completo
    if (error.status) {
      throw error
    }
    throw createError(500, 'Error unlocking user')
  }
}

module.exports = {
  create,
  getById,
  createUsers,
  getUsersByCompany,
  getAllUsers,
  updateUser,
  deleteUser,
  unlockUser
}
