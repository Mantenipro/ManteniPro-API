/* eslint-disable no-undef */
const Assignment = require('../models/assignment.model');
const Report = require('../models/report.model');
const CloseTicket = require('../models/closeTicket.model')

// Función para obtener todas las asignaciones de un técnico específico
async function getAllAssignments(technicianId) {
  try {
    const assignments = await Assignment.find({ technician: technicianId })
      .populate('technician') // Asegúrate de que los campos sean correctos
      .populate('report') // Asegúrate de que los campos sean correctos
    return assignments
  } catch (error) {
    throw new Error('Error al obtener las asignaciones: ' + error.message)
  }
}


async function addAssignment(assignmentData) {
  try {
    const { technician, report, priority, status } = assignmentData

    // Crear nueva asignación con el campo `assignedTo`
    console.log('Creando nueva asignación...')
    const newAssignment = new Assignment({ assignedTo: technician, report })
    await newAssignment.save()
    console.log('Nueva asignación creada:', newAssignment)

    // Crear un nuevo registro en CloseTicket
    console.log('Creando nuevo registro en CloseTicket...')
    const closeTicketData = {
      orderId: report,
      assignedTo: technician,
      solution: '', // Inicialmente vacío, se actualizará cuando se cierre el ticket
      endDate: null, // Inicialmente nulo, se actualizará cuando se cierre el ticket
      clientApproval: '', // Inicialmente vacío, se actualizará cuando se cierre el ticket
      assignedAt: new Date() // Establece la marca de tiempo actual
    }

    const newCloseTicket = new CloseTicket(closeTicketData)
    await newCloseTicket.save()
    console.log('Nuevo registro en CloseTicket creado:', newCloseTicket)

    // Actualizar el reporte con la nueva prioridad, estado, técnico asignado y closeTicketId
    console.log('Actualizando reporte...')
    const updatedReport = await Report.findByIdAndUpdate(
      report,
      {
        priority,
        status,
        assignedTo: technician,
        closeTicketId: newCloseTicket._id,
        assigned_at: new Date()
      },
      { new: true }
    )
    console.log('Reporte actualizado:', updatedReport)

    return { newAssignment, newCloseTicket }
  } catch (error) {
    console.error('Error al agregar la asignación:', error.message)
    throw new Error('Error al agregar la asignación: ' + error.message)
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
  addAssignment
}
