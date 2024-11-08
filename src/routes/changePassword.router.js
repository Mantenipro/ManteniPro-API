/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const User = require('../models/user.created.perfil')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth.middleware')

router.post('/', auth, async (request, response) => {
  const { currentPassword, newPassword } = request.body
  const userId = request.user.id

  try {
    const user = await User.findById(userId)

    if (!user) {
      return response.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return response
        .status(400)
        .json({ message: 'La contraseña actual es incorrecta' })
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.mustChangePassword = false
    await user.save()

    response
      .status(200)
      .json({ success: true , message: 'La contraseña ha sido cambiada exitosamente.' });
  } catch (err) {
    console.error('[Error en el servidor]', err)
    response.status(500).json({ message: 'Error en el servidor' })
  }
})

module.exports = router
