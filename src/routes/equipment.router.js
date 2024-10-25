const express = require('express');
const router = express.Router();  
const authMiddleware = require('../middleware/auth.middleware');
const equipmentUseCase = require('../usecases/equipment.usecase'); // Cambia la importación para usar el caso de uso

// Ruta para crear nuevo equipo
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Verifica que el usuario esté autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        // Extraer campos del cuerpo de la petición
        const { equipmentName, model, manufactureDate, brand, location, unitType, image, qr } = req.body;
        const userId = req.user.id;

        // Validación de campos requeridos
        if (!equipmentName || !model || !manufactureDate || !brand || !location || !unitType) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Llamada a la función de creación del equipo
        const newEquipment = await equipmentUseCase.createEquipment(
            equipmentName,
            model,
            manufactureDate,
            brand,
            location,
            unitType,
            image,
            qr,
            userId // Este es el owner
        );

        // Respuesta exitosa
        return res.status(201).json({ success: true, data: newEquipment });
    } catch (error) {
        console.error('Error creating equipment:', error.message);
        console.error('Error stack trace:', error.stack);

        // Manejo de errores específicos
        if (error.status) {
            return res.status(error.status).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: 'Error creating equipment' });
    }
});

module.exports = router;






