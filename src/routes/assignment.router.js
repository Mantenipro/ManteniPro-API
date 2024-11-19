/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  addAssignment,
  updateAssignmentFieldsById,
  updateAssignmentByReportId,
  getAssignmentByReportId
} = require('../usecases/assignment.usecase');
const auth = require('../middleware/auth.middleware');
const Report = require('../models/report.model');  


router.get('/', auth, async (req, res) => {
  const technicianId = req.user.id;
  try {
    const assignments = await getAllAssignments(technicianId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const newAssignment = await addAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


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


router.patch('/byReport/:reportId', auth, async (req, res) => {
  const reportId = req.params.reportId;
  const { solution, finishedAt, VaBo, status } = req.body;  

  try {
   
    const updatedAssignment = await updateAssignmentByReportId(reportId, { solution, finishedAt, VaBo, status });

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada para el reporte especificado' });
    }

    
    if (solution && finishedAt && VaBo) {
    
      await Report.findByIdAndUpdate(reportId, { status: 'completed' }, { new: true });
    }

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/byReport/:reportId', auth, async (req, res) => {
  const reportId = req.params.reportId;

  try {
    const assignment = await getAssignmentByReportId(reportId);

    if (!assignment) {
      return res.status(404).json({ message: 'No se encontró una asignación para el reporte especificado' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
