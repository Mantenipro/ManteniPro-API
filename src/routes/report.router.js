const express = require('express');
const createError = require('http-errors');
const reportUseCase = require('../usecases/report.usecase');
const Report = require('../models/report.model'); 

const router = express.Router();

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

module.exports = router;