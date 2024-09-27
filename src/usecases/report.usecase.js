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

module.exports = {
    createReport,
};
