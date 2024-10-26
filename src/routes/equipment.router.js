const express = require('express');
const router = express.Router();  
const authMiddleware = require('../middleware/auth.middleware');
const equipmentUseCase = require('../usecases/equipment.usecase'); 


router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const { equipmentName, model, manufactureDate, brand, location, unitType, image, qr, owner } = req.body; // Added owner
        const userId = req.user.id;

        if (!equipmentName || !model || !manufactureDate || !brand || !location || !unitType || !owner) { // Added check for owner
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


router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const equipmentId = req.params.id;
        const updatedData = req.body;

        const updatedEquipment = await equipmentUseCase.editEquipment(equipmentId, updatedData);
        
        return res.status(200).json({ success: true, data: updatedEquipment });
    } catch (error) {
        console.error('Error editing equipment:', error.message);
        console.error('Error stack trace:', error.stack);

        if (error.status) {
            return res.status(error.status).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: 'Error editing equipment' });
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const equipmentId = req.params.id;

        const deletedEquipment = await equipmentUseCase.deleteEquipment(equipmentId);
        
        return res.status(200).json({ success: true, data: deletedEquipment });
    } catch (error) {
        console.error('Error deleting equipment:', error.message);
        console.error('Error stack trace:', error.stack);

        if (error.status) {
            return res.status(error.status).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: 'Error deleting equipment' });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    try {
        const equipmentList = await equipmentUseCase.getAllEquipment();
        
        return res.status(200).json({ success: true, data: equipmentList });
    } catch (error) {
        console.error('Error retrieving equipment list:', error.message);
        console.error('Error stack trace:', error.stack);

        return res.status(500).json({ success: false, error: 'Error retrieving equipment list' });
    }
});


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const equipmentId = req.params.id;

        const equipment = await equipmentUseCase.getEquipmentById(equipmentId);
        
        return res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        console.error('Error retrieving equipment:', error.message);
        console.error('Error stack trace:', error.stack);

        if (error.status) {
            return res.status(error.status).json({ success: false, error: error.message });
        }
        return res.status(500).json({ success: false, error: 'Error retrieving equipment' });
    }
});

module.exports = router;








