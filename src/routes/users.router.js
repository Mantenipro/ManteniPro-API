/* eslint-disable no-undef */
const createError = require('http-errors'); // Manejo de errores
const express = require('express');
const usersUseCase = require('../usecases/users.usecase');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// GET /users
router.get('/', auth, async (request, response) => {
  try {
    const companyId = request.user.company._id; // Asegúrate de que el user tenga el companyId
    console.log('Company ID:', companyId); // Agrega esto para verificar el companyId
    const users = await usersUseCase.getUsersByCompany(companyId);

    response.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      success: false,
      error: error.message,
    });
  }
});

// GET /users/all
router.get('/all', auth, async (request, response) => {
  try {
    // Obtener todos los usuarios
    const users = await usersUseCase.getAllUsers(); // Llama a la nueva función

    response.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /users/:id/profile
router.get('/profile', auth, async (request, response) => {
  try {
    // Obtener el id del usuario desde el token decodificado
    const userId = request.user.id;

    // Obtener la información del usuario desde la base de datos usando el id del token
    const user = await usersUseCase.getById(userId);
    const { name, role, email, password, photo, company } = user;

    response.json({
      success: true,
      data: { name, role, email, password, photo, company },
    });
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /users
router.post('/', auth, async (request, response) => {
  try {
    // Verificar que el usuario logueado es un administrador
    console.log('request.user:', request.user);
    if (request.user.role !== 'admin') {
      throw createError(403, 'Access denied');
    }

    // Crear el nuevo usuario
    const newUser = await usersUseCase.createUsers(request.body, request.user.id);

    response.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /users/:userId
router.delete('/:userId', async (request, response) => {
  const { userId } = request.params;

  try {
    const userDeleted = await usersUseCase.deleteUser(userId)

    response.status(200).json({
      success: true,
      data: userDeleted
    })
  } catch (error) {
    response.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

//Get user by id para vista de administrador
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await usersUseCase.getById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Ruta para actualizar un usuario
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await usersUseCase.updateUser(userId, userData);
    res.status(200).json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});


module.exports = router;
