/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  updateCloseTicket,
  getCloseTicketById
} = require('../usecases/closeTicket.usecases')


// Obtener un cierre de ticket por ID
router.get('/:id', async (req, res) => {
  try {
    const closeTicket = await getCloseTicketById(req.params.id)
    if (!closeTicket) {
      return res.status(404).send()
    }
    res.status(200).send(closeTicket)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Actualizar un cierre de ticket
router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id // Obtener ID de los parámetros de la URL
    const data = req.body // Obtener datos del cuerpo de la solicitud

    const updatedCloseTicket = await updateCloseTicket(id, data)

    if (!updatedCloseTicket) {
      return res.status(404).send({ message: 'Cierre de ticket no encontrado' })
    }

    res.status(200).send(updatedCloseTicket)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

module.exports = router
