/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const Register = require('../models/user.created.perfil')
const crypto = require('crypto')
const { createTransporter } = require('../utils/mailUtils')

// Ruta para solicitar el restablecimiento de contraseña
router.post('/', async (request, response) => {
  const { email } = request.body

  try {
    const user = await Register.findOne({ email })

    if (!user) {
      return response.status(404).json({ message: 'Usuario no encontrado' })
    }

    if(user.isLocked) {
      return response.status(403).json({ success: false, message: 'Cuenta bloqueada' })
    }

    // Generar token de restablecimiento de contraseña
    const resetPasswordToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hora
    await user.save()

    // Enlace para el restablecimiento de contraseña
    const resetLink = `https://www.mantenipro.net/resetPassword/?q=${resetPasswordToken}`

    // Configuración del correo
    const transporter = await createTransporter()
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecimiento de Contraseña</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
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
                font-size: 28px;
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
              }
              .footer strong {
                color: #4361b2;
              }
              .signature {
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                color: #232c48;
              }
              .logo {
                position: absolute;
                bottom: 20px;
                right: 20px;
                max-width: 150px;
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
                        <h1>Restablecimiento de Contraseña</h1>
                        <p>Has solicitado un restablecimiento de contraseña para tu cuenta en Mantenipro.</p>
                        <p><span class="highlight">Correo electrónico:</span> ${email}</p>
                        <p>Haz clic en el siguiente <a href="${resetLink}">enlace</a> para restablecer tu contraseña:</p>
                        <p>Este enlace será válido por una hora.</p>
                        <p>Si no has solicitado el restablecimiento de contraseña, ignora este mensaje.</p>
                        <p class="footer">Atentamente, <br> Mantenipro</p>
                      </td>
                    </tr>
                    <!-- Logo en la parte inferior derecha -->
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
      `
    }

    // Enviar el correo
    await transporter.sendMail(mailOptions)

    response.status(200).json({
      message: 'Se ha enviado un correo para restablecer la contraseña.'
    })
  } catch (error) {
    response
      .status(500)
      .json({ message: 'Error al enviar el token de restablecimiento', error })
  }
})

module.exports = router
