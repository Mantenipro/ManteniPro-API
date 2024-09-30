/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const Register = require('../models/formRegister') 

router.post('/activate', async (request, response) => {
  const { email, activationCode } = request.body;

  try {
    const user = await Register.findOne({ email, activationCode });

    if (!user) {
      return response.status(400).json({ message: 'Código de activación inválido' });
    }

    user.isActive = true;
    user.activationCode = undefined; // Elimina el código de activación
    await user.save();

    res.status(200).json({ message: 'Cuenta activada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al activar la cuenta', error: err });
  }
});

module.exports = router;