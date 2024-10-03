/* eslint-disable no-undef */
const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const router = express.Router();
const Register = require('../models/formRegister');

router.post('/', async (request, response) => {
  const { id, activationCode } = request.body;  // Obtenemos el ID y el código del cuerpo de la solicitud

  try {
    // Buscar al usuario por el ID
    const user = await Register.findById(id);

    if (!user) {
      return response.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el código ha caducado
    if (moment().isAfter(user.activationCodeExpiration)) {
      return response.status(400).json({ message: 'El código de activación ha caducado.' });
    }

    // Comparar el código de activación ingresado con el hash almacenado
    const isMatch = await bcrypt.compare(activationCode, user.activationCodeHash);

    if (!isMatch) {
      return response.status(400).json({ message: 'Código de activación inválido.' });
    }

    // Activar la cuenta si el código es correcto
    user.isActive = true;
    user.activationCodeHash = undefined; // Eliminamos el hash del código de activación
    user.activationCodeExpiration = undefined; // Eliminamos la fecha de caducidad
    await user.save();

    response.status(200).json({ message: 'Cuenta activada exitosamente.' });
  } catch (err) {
    response.status(500).json({ message: 'Error al activar la cuenta', error: err });
  }
});

module.exports = router
