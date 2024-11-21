/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  addAssignment,
} = require('../usecases/assignment.usecase');
const auth = require('../middleware/auth.middleware');

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

module.exports = router;
