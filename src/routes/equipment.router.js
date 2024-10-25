const express = require('express');
const createError = require('http-errors');
const equipmentUseCase = require('../usecases/equipment.usecase');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { equipmentName, model, owner, manufactureDate, brand, location, unitType } = req.body; 

        // Verifica que se proporcionen todos los campos requeridos
        if (!equipmentName || !model || !owner || !manufactureDate || !brand || !location || !unitType) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        // Crea un nuevo equipo utilizando el caso de uso
        const newEquipment = await equipmentUseCase.createEquipment(req.body);

        // Responde con el nuevo equipo creado
        res.status(201).json({
            success: true,
            data: newEquipment,
        });
    } catch (error) {
        console.error('Error creating equipment:', error);
        // Maneja errores específicos que puedan ocurrir durante la creación
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error creating equipment',
        });
    }
});

module.exports = router;
