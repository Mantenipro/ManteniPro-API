/* eslint-disable no-undef */
const companies = require('../models/companies.model')
const createError = require('http-errors')

async function getCompanyInfo(companyId) {
  try {
    const company = await companies.findById(companyId).populate('subscription_type')
    if (!company) {
      throw createError(404, 'Company not found')
    }
    if (typeof company._id === 'undefined') {
      throw createError(500, 'Company data is corrupted')
    }
    return company
  } catch (error) {
    if (error.status && error.message) {
      throw error
    } else {
      throw createError(500, error.message)
    }
  }
}

async function createOrUpdateCompanyInfo(companyId, companyData) {
  try {
    let company = await companies.findById(companyId)
    if (!company) {
      // Crear una nueva empresa si no existe
      company = new companies({
        _id: companyId,
        ...companyData
      })
    } else {
      // Actualizar la empresa existente
      Object.assign(company, companyData)
    }
    await company.save()
    return company
  } catch (error) {
    if (error.status && error.message) {
      throw error
    } else {
      throw createError(500, error.message)
    }
  }
}

module.exports = {
  getCompanyInfo,
  createOrUpdateCompanyInfo
}
