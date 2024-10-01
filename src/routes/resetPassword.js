/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const Register = require('../models/user.created.perfil')
const bcrypt = require('bcryptjs')

router.post('/', async (request, response) => {
  const { token , newPassword } = request.body

  try {
    const user = await Register.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return response.status(400).json({ message: 'Token inválido o expirado' })
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()

    response.status(200)
      .json({ message: 'La contraseña ha sido cambiada exitosamente.' })
  } catch (err) {
    console.error('[Error en el servidor]', err)

    response.status(500).json({
      message: 'Error al actualizar la contraseña',
      error: err.message || 'Error desconocido'
    })
  }
})

module.exports = router
