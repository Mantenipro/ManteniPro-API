/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { checkSubscription } = require('../middleware/auth.middleware')
const Incident = require('../models/incident.model') // Asumiendo que tienes un modelo de incidentes

router.get('/incidents', checkSubscription, async (req, res) => {
  const { plan } = req.subscription
  const userId = req.user._id

  let maxIncidents, responseTime, incidentHistory

  if (plan === 'basic_plan') {
    maxIncidents = 10
    responseTime = '48 a 72 horas'
    incidentHistory = 30 // días
  } else if (plan === 'premium_plan') {
    maxIncidents = 100
    responseTime = '24 a 48 horas'
    incidentHistory = 180 // días
  }

  // Obtener el número de incidencias del usuario en el mes actual
  const currentMonth = new Date().getMonth()
  const incidentsThisMonth = await Incident.countDocuments({
    userId,
    createdAt: {
      $gte: new Date(new Date().setDate(1)),
      $lt: new Date(new Date().setMonth(currentMonth + 1, 1))
    }
  })

  if (incidentsThisMonth >= maxIncidents) {
    return res
      .status(403)
      .send(
        `Has alcanzado el límite de ${maxIncidents} incidencias para este mes.`
      )
  }

  // Obtener el historial de incidencias según el plan
  const incidents = await Incident.find({
    userId,
    createdAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - incidentHistory))
    }
  })

  res.json({
    incidents,
    responseTime,
    maxIncidents,
    incidentHistory
  })
})

module.exports = router

// falta implementarlo en el server.js
