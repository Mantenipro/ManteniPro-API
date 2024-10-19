/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const createError = require('http-errors');
const reportUseCase = require('../usecases/report.usecase');
const Report = require('../models/report.model');
const { S3Client } = require('@aws-sdk/client-s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

// Configura AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Endpoint para generar una URL pre-firmada (presigned URL) para subir una imagen a S3
router.post('/s3/presigned-url', async (req, res) => {
    try {
        const { fileName, fileType } = req.body;

        // Parámetros para generar la URL pre-firmada
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // Nombre del bucket
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

// Endpoint para crear un nuevo reporte
router.post('/', async (req, res) => {
    try {
        const { title, image, description, user, company } = req.body;
        if (!title || !user || !company) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos',
            });
        }
        const newReport = await Report.create({
            title,
            image,
            description,
            user,
            company,
        });

        res.status(201).json({
            success: true,
            data: newReport,
        });
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear el reporte',
        });
    }
});

// Otros endpoints (get, put, delete) permanecen igual
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        console.error('Error al obtener los reportes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los reportes',
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener el reporte',
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, image, description, user, company } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { title, image, description, user, company },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedReport,
        });
    } catch (error) {
        console.error('Error al modificar el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al modificar el reporte',
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: deletedReport,
        });
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar el reporte',
        });
    }
});

module.exports = router;

