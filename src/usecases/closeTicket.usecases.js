/* eslint-disable no-undef */
const CloseTicket = require('../models/closeTicket.model')
const Report = require('../models/report.model')

// Crear un nuevo cierre de ticket
const updateCloseTicket = async (id, data) => {
  try {

    const updatedData = {
      ...data,
      isCompleted: true
    }

    const updatedCloseTicket = await CloseTicket.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    )

    if (!updatedCloseTicket) {
      throw new Error('Cierre de ticket no encontrado')
    }

     if (!updatedCloseTicket) {
       throw new Error('Cierre de ticket no encontrado')
     }

     // Obtener el orderId relacionado
     const { orderId } = updatedCloseTicket

     if (orderId) {
       // Actualizar el status del reporte relacionado
       const updatedReport = await Report.findByIdAndUpdate(
         orderId,
         { 
          status: 'completed', 
          closed_at: new Date() 
         },
         { new: true }
       )

       if (!updatedReport) {
         console.warn(`Reporte con ID ${orderId} no encontrado`)
       } else {
         console.log(`Reporte actualizado: ${updatedReport}`)
       }
     }

    return updatedCloseTicket
  } catch (error) {
    console.error(`Error al actualizar el cierre de ticket: ${error.message}`)
    throw error
  }
}


// Obtener un cierre de ticket por ID
const getCloseTicketById = async (id) => {
  try {
    // Verificar la existencia de los documentos referenciados
    const closeTicket = await CloseTicket.findById(id)
    if (!closeTicket) {
      throw new Error('Cierre de ticket no encontrado')
    }

    // Realizar la operación populate
    const populatedCloseTicket = await CloseTicket.findById(id)
      .populate('assignedTo')
      .populate('orderId')

    return populatedCloseTicket
  } catch (error) {
    console.error(`Error al obtener el cierre de ticket: ${error.message}`)
    throw error
  }
}

module.exports = {
  updateCloseTicket,
  getCloseTicketById
}
