/* eslint-disable no-undef */
const companies = require('../models/companies.model')
const createError = require('http-errors')

async function getCompanyInfo(companyId) {
  try {
    const company = await companies.findById(companyId)
    if (!company) {
      throw createError(404, 'Company not found')
    }
    return company
  } catch (error) {
    throw createError(500, error.message)
  }
}

module.exports = {
  getCompanyInfo
}
