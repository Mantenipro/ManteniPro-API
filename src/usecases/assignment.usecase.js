/* eslint-disable no-undef */
const Assignment = require('../models/assignment.model')
const Report = require('../models/report.model')

// Función para obtener todas las asignaciones de un técnico específico
async function getAllAssignments(technicianId) {
  try {
    const assignments = await Assignment.find({ technician: technicianId })
      .populate('technician') // Asegúrate de que los campos sean correctos
      .populate('report'); // Asegúrate de que los campos sean correctos
    return assignments;
  } catch (error) {
    throw new Error('Error al obtener las asignaciones: ' + error.message);
  }
}


// Función para agregar una nueva asignación
async function addAssignment(assignmentData) {
  try {
    const { technician, report, priority, status } = assignmentData;

    // Crear nueva asignación
    const newAssignment = new Assignment({ technician, report });
    await newAssignment.save();

    // Actualizar el reporte con la nueva prioridad y estado
    await Report.findByIdAndUpdate(
      report,
      { priority, status },
      { new: true }
    );

    return newAssignment;
  } catch (error) {
    throw new Error('Error al agregar la asignación: ' + error.message);
  }
}


module.exports = {
  getAllAssignments,
  addAssignment
}



