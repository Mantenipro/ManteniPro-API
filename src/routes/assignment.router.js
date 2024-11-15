/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  addAssignment,
  updateAssignmentFieldsById,
  updateAssignmentByReportId
} = require('../usecases/assignment.usecase');
const auth = require('../middleware/auth.middleware');
const Report = require('../models/report.model');  // Importar el modelo Report

// Ruta para obtener todas las asignaciones de un técnico específico
router.get('/', auth, async (req, res) => {
  const technicianId = req.user.id;
  try {
    const assignments = await getAllAssignments(technicianId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar una nueva asignación
router.post('/', async (req, res) => {
  try {
    const newAssignment = await addAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Nueva ruta para actualizar los campos solution, finishedAt y VaBo por ID
router.patch('/:id', auth, async (req, res) => {
  const assignmentId = req.params.id;
  const { solution, finishedAt, VaBo } = req.body;

  try {
    const updatedAssignment = await updateAssignmentFieldsById(assignmentId, { solution, finishedAt, VaBo });

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Nueva ruta para actualizar el equipo asignado basado en el ID del reporte
router.patch('/byReport/:reportId', auth, async (req, res) => {
  const reportId = req.params.reportId;
  const { solution, finishedAt, VaBo, status } = req.body;  // Ahora también extraemos 'status'

  try {
    // Pasamos 'status' a la función junto con los otros campos
    const updatedAssignment = await updateAssignmentByReportId(reportId, { solution, finishedAt, VaBo, status });

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada para el reporte especificado' });
    }

    // Verificar si los campos necesarios están completos para cambiar el estado a "completed"
    if (solution && finishedAt && VaBo) {
      // Actualizar el estado del reporte a "completed"
      await Report.findByIdAndUpdate(reportId, { status: 'completed' }, { new: true });
    }

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
