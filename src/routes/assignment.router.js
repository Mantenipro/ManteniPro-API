/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  getAllAssignments,
  addAssignment,
  updateAssignmentFieldsById,
  updateAssignmentByReportId
} = require('../controllers/assignment.controller');
const Report = require('../models/report.model'); // Importar el modelo Report

// Endpoint para obtener todas las peticiones sin filtrar
router.get('/all', async (req, res) => {
  try {
    const assignments = await getAllRequests();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para obtener asignaciones de un técnico específico
router.get('/:technicianId', async (req, res) => {
  const { technicianId } = req.params;
  try {
    const assignments = await getAllAssignments(technicianId);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para agregar una nueva asignación
router.post('/', async (req, res) => {
  try {
    const newAssignment = await addAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para actualizar campos por ID de asignación
router.patch('/:assignmentId', async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const updatedAssignment = await updateAssignmentFieldsById(assignmentId, req.body);
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para actualizar campos por ID de reporte
router.patch('/report/:reportId', async (req, res) => {
  const { reportId } = req.params;
  try {
    const updatedAssignment = await updateAssignmentByReportId(reportId, req.body);
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
