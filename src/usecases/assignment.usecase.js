/* eslint-disable no-undef */
const Assignment = require('../models/assignment.model');
const Report = require('../models/report.model');


async function getAllAssignments(technicianId) {
  try {
    const assignments = await Assignment.find({ technician: technicianId })
      .populate('technician') 
      .populate('report');
    return assignments;
  } catch (error) {
    throw new Error('Error al obtener las asignaciones: ' + error.message);
  }
}


async function addAssignment(assignmentData) {
  try {
    const { technician, report, priority, status } = assignmentData;

    
    const newAssignment = new Assignment({ assignedTo: technician, report });
    await newAssignment.save();

    
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


async function updateAssignmentFieldsById(assignmentId, updateData) {
  try {
    const { solution, finishedAt, VaBo } = updateData;

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
    const { solution, finishedAt, VaBo, status } = updateData; 

    
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { report: reportId }, 
      { solution, finishedAt, VaBo, status }, 
      { new: true, runValidators: true } 
    );

    if (!updatedAssignment) {
      throw new Error('Asignación no encontrada para el reporte especificado');
    }

    
    if (solution && finishedAt && VaBo) {
      await Report.findByIdAndUpdate(reportId, { status: 'completed' }, { new: true });
    }

    return updatedAssignment;
  } catch (error) {
    throw new Error('Error al actualizar la asignación por ID de reporte: ' + error.message);
  }
}

async function getAssignmentByReportId(reportId) {
  try {
    const assignment = await Assignment.findOne({ report: reportId })
      .populate('assignedTo') 
      .populate('report'); 

    if (!assignment) {
      throw new Error('No se encontró una asignación para el reporte especificado');
    }

    return assignment;
  } catch (error) {
    throw new Error('Error al obtener la asignación por ID de reporte: ' + error.message);
  }
}



module.exports = {
  getAllAssignments,
  addAssignment,
  updateAssignmentFieldsById,
  updateAssignmentByReportId,
  getAssignmentByReportId
};
