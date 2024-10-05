/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const Register = require('../models/user.created.perfil')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mantenipro6@gmail.com',
    pass: 'cwqnmwkddweqioxl'
  }
})

// Ruta para solicitar el restablecimiento de contraseña
router.post('/', async (request, response) => {
  const { email } = request.body

  try {
    const user = await Register.findOne({ email })

    if (!user) {
      return response.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Generar token de restablecimiento de contraseña
    const resetPasswordToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hora
    await user.save()

    // Enviar correo electrónico con el enlace de restablecimiento
    const resetLink = `http://localhost:3000/resetPassword/?q=${resetPasswordToken}`
    await transporter.sendMail({
      to: email,
      from: 'no-reply@mantenipro.com',
      subject: 'Restablecimiento de contraseña',
      html: `<p>Has solicitado un restablecimiento de contraseña.</p>
             <p>Haz clic en este <a href="${resetLink}">enlace</a> para restablecer tu contraseña.</p>`
    })

    response
      .status(200)
      .json({
        message: 'Se ha enviado un correo para restablecer la contraseña.'
      })
  } catch (err) {
    response.status(500).json({
      message: 'Error al enviar el token de restablecimiento',
      error: err
    })
  }
})


module.exports = router