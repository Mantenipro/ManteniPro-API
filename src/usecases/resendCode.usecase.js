/* eslint-disable no-undef */
const createError = require('http-errors')
const users = require('../models/user.created.perfil')
const jwt = require('../lib/jwt')
const { createTransporter } = require('../utils/mailUtils')
const {
  generateActivationCode,
  hashActivationCode
} = require('../utils/tokenUtils')
const moment = require('moment')

async function resendActivationCode(email) {
  // Verificar si el email existe en la base de datos
  const user = await users.findOne({ email }).populate('formRegister')

  if (!user) {
    // Lanzar un error 404 si el email no se encuentra
    throw createError(404, 'Email no encontrado')
  }

  // Generar un nuevo código de activación
  const activationCode = generateActivationCode()

  // Actualizar el usuario con el nuevo código de activación y la nueva fecha de expiración
  if(user.role === 'admin') {
    user.formRegister.activationCodeHash = await hashActivationCode(activationCode)
    user.formRegister.activationCodeExpiration = moment()
      .add(1, 'hours')
      .toDate()
    await user.formRegister.save()
   } else {
     user.activationCodeHash = await hashActivationCode(activationCode)
     user.activationCodeExpiration = moment().add(1, 'hours').toDate()
     await user.save()
   }

  // Generar el token JWT
  const tokenPayload = user.role === 'admin' ? { id: user.formRegister.id } : { id: user._id }

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
  
  const activationPath = user.role === 'admin' ? 'activate' : 'userActivate'
  const activationLink = `http://localhost:3000/${activationPath}?token=${token}`
  const transporter = await createTransporter()
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reenvío de código de activación',
    html: `<p>Tu nuevo código de activación es: ${activationCode}. Tienes una hora para activarla.</p> 
           <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta: <a href="${activationLink}">Activar Cuenta</a></p>`
  }

  await transporter.sendMail(mailOptions)

  return { message: 'Código de activación reenviado' }
}

module.exports = {
  resendActivationCode
}
