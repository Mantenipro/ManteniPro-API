/* eslint-disable no-undef */
const Assignment = require('../models/assignment.model');
const Report = require('../models/report.model');

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

    // Crear nueva asignación con el campo `assignedTo`
    const newAssignment = new Assignment({ assignedTo: technician, report });
    await newAssignment.save();

    // Actualizar el reporte con la nueva prioridad, estado y técnico asignado
    await Report.findByIdAndUpdate(
      report,
      { priority, status, assignedTo: technician },
      { new: true }
    );

    return newAssignment;
  } catch (error) {
    throw new Error('Error al agregar la asignación: ' + error.message);
  }
}

// Nueva función para editar los campos: solution, finishedAt, VaBo
async function updateAssignmentFieldsById(assignmentId, updateData) {
  try {
    const { solution, finishedAt, VaBo } = updateData;

    // Actualizar solo los campos permitidos
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { solution, finishedAt, VaBo },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      throw new Error('Asignación no encontrada');
    }

    return updatedAssignment;
  } catch (error) {
    throw new Error('Error al actualizar la asignación: ' + error.message);
  }
}

async function updateAssignmentByReportId(reportId, updateData) {
  try {
    const { solution, finishedAt, VaBo, status } = updateData; // Extraemos los campos necesarios

    // Buscar la asignación usando el reportId
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { report: reportId }, // Usar reportId para encontrar la asignación
      { solution, finishedAt, VaBo, status }, // Incluir 'status' en los campos a actualizar
      { new: true, runValidators: true } // Asegurarse de que se validen los datos
    );

    if (!updatedAssignment) {
      throw new Error('Asignación no encontrada para el reporte especificado');
    }

    // Si todos los campos requeridos están presentes, cambiamos el estado del reporte a "completed"
    if (solution && finishedAt && VaBo) {
      await Report.findByIdAndUpdate(reportId, { status: 'completed' }, { new: true });
    }

    return updatedAssignment;
  } catch (error) {
    throw new Error('Error al actualizar la asignación por ID de reporte: ' + error.message);
  }
}

module.exports = {
  getAllAssignments,
  addAssignment,
  updateAssignmentFieldsById,
  updateAssignmentByReportId // Exportar la nueva función
};
