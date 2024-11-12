/* eslint-disable no-undef */
const createError = require('http-errors');
const Report = require('../models/report.model');

async function createReport(title, image, description, user, company, equipment, status, priority) {
    try {
        if (!title || !description || !user || !company || !equipment) {
            throw createError(400, 'Faltan campos requeridos');
        }

        // Validar que el status esté dentro de los valores permitidos
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            throw createError(400, 'Estado inválido');
        }

        // Validar que la prioridad esté dentro de los valores permitidos
        const validPriorities = ['Baja', 'Media', 'Alta', 'Sin Prioridad'];
        if (priority && !validPriorities.includes(priority)) {
            throw createError(400, 'Prioridad inválida');
        }

        // Crear el nuevo reporte
        const newReport = await Report.create({
            title,
            image,
            description,
            user,
            company,
            equipment,
            status, // Incluir status solo si se proporciona
            priority: priority || 'Sin Prioridad', // Asignar valor predeterminado a priority
        });

        return newReport;
    } catch (error) {
        throw createError(500, `Error al crear el reporte: ${error.message}`);
    }
}

async function getAllReports(priority) {
    try {
        // Si se proporciona un valor de prioridad, filtrar por ella
        const filter = priority ? { priority } : {}; // Si no se pasa 'priority', obtenemos todos los reportes
        const reports = await Report.find(filter);
        return reports;
    } catch (error) {
        throw createError(500, `Error al obtener los reportes: ${error.message}`);
    }
}

async function getReportById(id) {
    try {
        const report = await Report.findById(id)
          .populate({
            path: 'user',
            populate: {
              path: 'company', // Popula la compañía dentro del usuario
              model: 'Company'
            }
          })
          .populate('equipment')
        if (!report) {
            throw createError(404, 'Reporte no encontrado');
        }
        return report;
    } catch (error) {
        throw createError(500, `Error al obtener el reporte: ${error.message}`);
    }
}

async function updateReport(id, title, image, description, user, company, equipment, status, priority) {
    try {
        // Crear un objeto con los campos a actualizar
        const updates = { title, image, description, user, company, equipment };

        // Solo agregar status si se ha proporcionado
        if (status) {
            // Validar que el status esté dentro de los valores permitidos
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(status)) {
                throw createError(400, 'Estado inválido');
            }
            updates.status = status;
        }

        // Validar que la prioridad esté dentro de los valores permitidos
        if (priority) {
            const validPriorities = ['Baja', 'Media', 'Alta', 'Sin Prioridad'];
            if (!validPriorities.includes(priority)) {
                throw createError(400, 'Prioridad inválida');
            }
            updates.priority = priority;
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
    getReportsByCompany,
};

