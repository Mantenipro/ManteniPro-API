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
