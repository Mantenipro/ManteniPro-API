/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { getCompanyInfo } = require('../usecases/companies.usecase')
const auth = require('../middleware/auth.middleware') // Importar el middleware de autenticación

router.get('/', auth, async (request, response) => {
  // Usar el middleware aquí
  try {
    const companyId = request.user._id // Usar el _id del usuario autenticado
    const companyInfo = await getCompanyInfo(companyId)
    response.status(200).json(companyInfo)
  } catch (error) {
    response.status(error.status || 500).json({ message: error.message })
  }
})

module.exports = router
