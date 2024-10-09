/* eslint-disable no-undef */
const bcrypt = require('bcryptjs')
const fs = require('fs')
const oauth2Client = require('../config/oauth2Config')

async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken()
    return token
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      console.error(
        'Error: El token de autenticación es inválido o ha expirado. Por favor, verifica tus credenciales y permisos.'
      )
      await regenerateRefreshToken()
    } else {
      console.error('Error obteniendo el token de acceso:', error)
    }
    throw error
  }
}

async function regenerateRefreshToken() {
  try {
    const newTokenResponse = await oauth2Client.refreshAccessToken()
    const newRefreshToken = newTokenResponse.credentials.refresh_token

    if (newRefreshToken) {
      const envFilePath = '.env'
      const envConfig = fs.readFileSync(envFilePath, 'utf8').split('\n')
      const updatedEnvConfig = envConfig
        .map((line) => {
          if (line.startsWith('REFRESH_TOKEN=')) {
            return `REFRESH_TOKEN=${newRefreshToken}`
          }
          return line
        })
        .join('\n')

      fs.writeFileSync(envFilePath, updatedEnvConfig, 'utf8')
      console.log('Nuevo refresh token generado y almacenado en .env.')
    }
  } catch (error) {
    console.error('Error regenerando el refresh token:', error)
    throw error
  }
}

function generateActivationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function hashActivationCode(activationCode) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(activationCode, salt)
}

module.exports = {
  getAccessToken,
  regenerateRefreshToken,
  generateActivationCode,
  hashActivationCode
}
