const createError = require('http-errors');
const Assignment = require('../models/assignment.model');

async function createAssignment(assignedTo, company, priority, idReport) {
    try {
        if (!assignedTo || !company || !priority || !idReport) {
            throw createError(400, 'Faltan campos requeridos');
        }

        const newAssignment = await Assignment.create({
            assignedTo,
            company,
            priority,
            idReport 
        });

        return newAssignment;
    } catch (error) {
        throw createError(500, `Error al crear la asignación: ${error.message}`);
    }
}

async function getAllAssignments() {
    try {
        const assignments = await Assignment.find();
        return assignments;
    } catch (error) {
        throw createError(500, `Error al obtener las asignaciones: ${error.message}`);
    }
}

async function getAssignmentById(id) {
    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            throw createError(404, 'Asignación no encontrada');
        }
        return assignment;
    } catch (error) {
        throw createError(500, `Error al obtener la asignación: ${error.message}`);
    }
}

async function updateAssignment(id, assignedTo, company, priority, idReport) {
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            { assignedTo, company, priority, idReport }, 
            { new: true, runValidators: true }
        );

        if (!updatedAssignment) {
            throw createError(404, 'Asignación no encontrada');
        }
        return updatedAssignment;
    } catch (error) {
        throw createError(500, `Error al modificar la asignación: ${error.message}`);
    }
}

async function deleteAssignment(id) {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            throw createError(404, 'Asignación no encontrada');
        }
        return deletedAssignment;
    } catch (error) {
        throw createError(500, `Error al eliminar la asignación: ${error.message}`);
    }
}

module.exports = {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};




