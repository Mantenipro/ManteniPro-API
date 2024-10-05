const createError = require('http-errors');
const Report = require('../models/report.model');

async function createReport(title, image, description, user, company) {
    try {
        if (!title || !description || !user || !company) {
            throw createError(400, 'Faltan campos requeridos');
        }

        const newReport = await Report.create({
            title,
            image,
            description,
            user,
            company
        });

        return newReport;
    } catch (error) {
        throw createError(500, `Error al crear el reporte: ${error.message}`);
    }
}

async function getAllReports() {
    try {
        const reports = await Report.find();
        return reports;
    } catch (error) {
        throw createError(500, `Error al obtener los reportes: ${error.message}`);
    }
}

async function getReportById(id) {
    try {
        const report = await Report.findById(id);
        if (!report) {
            throw createError(404, 'Reporte no encontrado');
        }
        return report;
    } catch (error) {
        throw createError(500, `Error al obtener el reporte: ${error.message}`);
    }
}

async function updateReport(id, title, image, description, user, company) {
    try {
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { title, image, description, user, company },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            throw createError(404, 'Reporte no encontrado');
        }
        return updatedReport;
    } catch (error) {
        throw createError(500, `Error al modificar el reporte: ${error.message}`);
    }
}

async function deleteReport(id) {
    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            throw createError(404, 'Reporte no encontrado');
        }
        return deletedReport;
    } catch (error) {
        throw createError(500, `Error al eliminar el reporte: ${error.message}`);
    }
}

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
};