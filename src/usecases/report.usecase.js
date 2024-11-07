const createError = require('http-errors');
const Report = require('../models/report.model');

async function createReport(title, image, description, user, company, equipment, status) {
    try {
        if (!title || !description || !user || !company || !equipment || !status) {
            throw createError(400, 'Faltan campos requeridos');
        }

        // Validar que el status esté dentro de los valores permitidos
        const validStatuses = ['pending', 'in-progress', 'completed',];
        if (!validStatuses.includes(status)) {
            throw createError(400, 'Estado inválido');
        }

        const newReport = await Report.create({
            title,
            image,
            description,
            user,
            company,
            equipment,
            status // Incluir status en la creación del reporte
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

async function updateReport(id, title, image, description, user, company, equipment, status) {
    try {
        // Crear un objeto con los campos a actualizar
        const updates = { title, image, description, user, company, equipment };

        // Solo agregar status si se ha proporcionado
        if (status) {
            // Validar que el status esté dentro de los valores permitidos
            const validStatuses = ['pending', 'in-progress', 'completed', ];
            if (!validStatuses.includes(status)) {
                throw createError(400, 'Estado inválido');
            }
            updates.status = status;
        }

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            updates,
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

async function getReportsByUser(userId) {
    try {
        const reports = await Report.find({ user: userId });
        if (!reports || reports.length === 0) {
            throw createError(404, 'No se encontraron reportes para el usuario especificado');
        }
        return reports;
    } catch (error) {
        throw createError(500, `Error al obtener los reportes por usuario: ${error.message}`);
    }
}

async function getReportsByCompany(companyId) {
    try {
        const reports = await Report.find({ company: companyId });
        if (!reports || reports.length === 0) {
            throw createError(404, 'No se encontraron reportes para la compañía especificada');
        }
        return reports;
    } catch (error) {
        throw createError(500, `Error al obtener los reportes por compañía: ${error.message}`);
    }
}

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportsByUser,
};

