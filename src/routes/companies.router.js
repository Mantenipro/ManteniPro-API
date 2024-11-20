/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { getCompanyInfo, createOrUpdateCompanyInfo } = require('../usecases/companies.usecase')
const auth = require('../middleware/auth.middleware') // Importar el middleware de autenticación

router.get('/',auth, async (request, response) => {
  // Usar el middleware aquí
  try {
    const companyId = request.user.company._id // Usar el _id del usuario autenticado
    const companyInfo = await getCompanyInfo(companyId)
    response.status(200).json(companyInfo)
  } catch (error) {
    response.status(error.status || 500).json({ message: error.message })
  }
})

router.put('/', auth, async (request, response) => {
  // Usar el middleware aquí
  try {
    const companyId = request.user.company._id // Usar el _id del usuario autenticado
    const companyData = request.body // Obtener los datos de la empresa del cuerpo de la solicitud
    const updatedCompanyInfo = await createOrUpdateCompanyInfo(
      companyId,
      companyData
    )
    response.status(200).json(updatedCompanyInfo)
  } catch (error) {
    response.status(error.status || 500).json({ message: error.message })
  }
})

module.exports = router
