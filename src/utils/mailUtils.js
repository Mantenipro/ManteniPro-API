/* eslint-disable no-undef */
const nodemailer = require('nodemailer')
const { getAccessToken } = require('./tokenUtils')

async function createTransporter() {
  const accessToken = await getAccessToken()
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  })
}

module.exports = { createTransporter }
