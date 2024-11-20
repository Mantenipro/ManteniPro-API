/* eslint-disable no-undef */
const Users = require('../models/user.created.perfil')
const crypto = require('crypto')
const { createTransporter } = require('../utils/mailUtils') // Asegúrate de que la ruta sea correcta
const encrypt = require('../lib/encrypt')

const MAX_ATTEMPTS = 3 // Máximo de intentos permitidos

async function loginAttemptCounter(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await Users.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Usuario no Encontrado' })
    }

    if (user.isLocked) {
      return res
        .status(403)
        .json({ success: false, message: 'Cuenta Bloqueada' })
    }

      const isPasswordValid = await encrypt.compare(password, user.password)


    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.isLocked = true // bloquea el usuario
        user.unlockRequested = true
      }
      // Lógica específica por rol
      if (user.role === 'admin' && user.isLocked) {
        // Generar un token para cambio de contraseña
        const resetPasswordToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hora

        // Enviar correo electrónico con el enlace de restablecimiento
        const resetLink = `http://localhost:3000/resetPassword/?q=${resetPasswordToken}`
        const transporter = await createTransporter()
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Desbloqueo de contraseña',
          html: `<p>Has solicitado el desbloqueo de tu contraseña.</p>
               <p>Haz clic en este <a href="${resetLink}">enlace</a> para restablecer tu contraseña.</p>`
        }

        await transporter.sendMail(mailOptions)

        await user.save()
        return res.status(403).json({
          message: 'Se ha enviado un correo para restablecer la contraseña.'
        })
      } else if (
        (user.role === 'usuario' || user.role === 'tecnico') &&
        user.isLocked
      ) {
        await user.save()
        return res.status(403).json({
          success: false,
          message:
            'Tu cuenta está bloqueada. Por favor, contacta a tu administrador para desbloquear tu cuenta.'
        })
      }

      await user.save()
      return res
        .status(401)
        .json({ success: false, message: 'Contraseña incorrecta' })
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = loginAttemptCounter
