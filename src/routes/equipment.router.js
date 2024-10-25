const express = require('express');
const router = express.Router();  
const authMiddleware = require('../middleware/auth.middleware');
const equipmentUseCase = require('../usecases/equipment.usecase'); 

router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const { equipmentName, model, manufactureDate, brand, location, unitType, image, qr, owner } = req.body; // Agregado owner
        const userId = req.user.id;

        if (!equipmentName || !model || !manufactureDate || !brand || !location || !unitType || !owner) { // Agregado check para owner
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newEquipment = await equipmentUseCase.createEquipment(
            equipmentName,
            model,
            manufactureDate,
            brand,
            location,
            unitType,
            image,
            qr,
            userId,
            owner 
        );

        return res.status(201).json({ success: true, data: newEquipment });
    } catch (error) {
        console.error('Error creating equipment:', error.message);
        console.error('Error stack trace:', error.stack);

        if (error.status) {
            return res.status(error.status).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: 'Error creating equipment' });
    }
});

module.exports = router;







