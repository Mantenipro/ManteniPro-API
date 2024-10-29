const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const authMiddleware = require('../middleware/auth.middleware');
const equipmentUseCase = require('../usecases/equipment.usecase');

const router = express.Router();

// Configuración de AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Endpoint para generar una URL pre-firmada para subir una imagen a S3
router.post('/s3/presigned-url', async (req, res) => {
    try {
        const { fileName, fileType } = req.body;

        // Parámetros para generar la URL pre-firmada
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // Nombre del bucket en S3
            Key: fileName,                      // Nombre del archivo en S3
            ContentType: fileType,              // Tipo de contenido (MIME type) del archivo
        };

        // Genera la URL pre-firmada
        const command = new PutObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // URL válida por 60 segundos

        // Enviar la URL pre-firmada al frontend
        res.json({ url: signedUrl });
    } catch (error) {
        console.error('Error generando la URL pre-firmada:', error);
        res.status(500).json({
            success: false,
            error: 'Error generating presigned URL',
        });
    }
});

// Endpoint para crear un nuevo equipo
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const { equipmentName, model, manufactureDate, brand, location, unitType, image, qr, owner } = req.body; 
        const userId = req.user.id;

        // Validación de campos requeridos
        if (!equipmentName || !model || !manufactureDate || !brand || !location || !unitType || !owner) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newEquipment = await equipmentUseCase.createEquipment(
            equipmentName,
            model,
            manufactureDate,
            brand,
            location,
            unitType,
            image,  // Se almacena la URL de S3 aquí
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

// Endpoint para actualizar equipo por ID
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

// Endpoint para eliminar equipo por ID
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

// Endpoint para obtener todos los equipos
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

// Endpoint para obtener equipo por ID
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









