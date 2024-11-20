/* eslint-disable no-undef */
const express = require('express');
const registerUseCase = require('../usecases/register.usecase');

const router = express.Router();

// POST /register
router.post('/', async (request, response) => {
  try {
    const registerCreated = await registerUseCase.create(request.body);
    response.json({
      success: true,
      data: { user: registerCreated }
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      success: false,
      error: error.message
    });
  }
});

// GET /register - Obtener todos los registros
router.get('/', async (request, response) => {
  try {
    const allRegisters = await registerUseCase.getAll();
    response.json({
      success: true,
      data: allRegisters
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      success: false,
      error: error.message
    });
  }
});

// GET /register/:id - Obtener un registro por ID
router.get('/:id', async (request, response) => {
  try {
    const registerById = await registerUseCase.getById(request.params.id);
    response.json({
      success: true,
      data: registerById
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /register/:id - Eliminar un registro por ID
router.delete('/:id', async (request, response) => {
  try {
    const deletedRegister = await registerUseCase.deleteById(request.params.id);
    response.json({
      success: true,
      message: 'Register deleted successfully',
      data: deletedRegister
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
