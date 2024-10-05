const express = require('express');
const createError = require('http-errors');
const assignmentUseCase = require('../usecases/assignment.usecase');

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { assignedTo, company, priority, idReport } = req.body; 
        if (!assignedTo || !company || !priority || !idReport) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos',
            });
        }

        const newAssignment = await assignmentUseCase.createAssignment(assignedTo, company, priority, idReport);

        res.status(201).json({
            success: true,
            data: newAssignment,
        });
    } catch (error) {
        console.error('Error al crear la asignación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear la asignación',
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const assignments = await assignmentUseCase.getAllAssignments();
        res.status(200).json({
            success: true,
            data: assignments,
        });
    } catch (error) {
        console.error('Error al obtener las asignaciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las asignaciones',
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const assignment = await assignmentUseCase.getAssignmentById(req.params.id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                error: 'Asignación no encontrada',
            });
        }
        res.status(200).json({
            success: true,
            data: assignment,
        });
    } catch (error) {
        console.error('Error al obtener la asignación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la asignación',
        });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { assignedTo, company, priority, idReport } = req.body; 
        const updatedAssignment = await assignmentUseCase.updateAssignment(
            req.params.id,
            assignedTo,
            company,
            priority,
            idReport
        );

        if (!updatedAssignment) {
            return res.status(404).json({
                success: false,
                error: 'Asignación no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAssignment,
        });
    } catch (error) {
        console.error('Error al modificar la asignación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al modificar la asignación',
        });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedAssignment = await assignmentUseCase.deleteAssignment(req.params.id);
        if (!deletedAssignment) {
            return res.status(404).json({
                success: false,
                error: 'Asignación no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            data: deletedAssignment,
        });
    } catch (error) {
        console.error('Error al eliminar la asignación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar la asignación',
        });
    }
});

module.exports = router;
