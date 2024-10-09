/* eslint-disable no-undef */
const moment = require('moment')
const { createTransporter } = require('../../utils/mailUtils')
const {
  generateActivationCode,
  hashActivationCode
} = require('../../utils/tokenUtils')

async function preSaveHook(next) {
  if (this.isNew) {
    try {
      const activationCode = generateActivationCode()
      const activationLink = `http://localhost:3000/activate?id=${this._id}`
      const transporter = await createTransporter()
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: this.email,
        subject: 'Activación de tu cuenta',
        text: `Gracias por registrarte. Tu código de activación es: ${activationCode}. 
               Por favor, haz clic en el siguiente enlace para activar tu cuenta: ${activationLink}`
      }

      await transporter.sendMail(mailOptions)

      this.activationCodeHash = await hashActivationCode(activationCode)
      this.activationCodeExpiration = moment().add(7, 'days').toDate()

      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
}

module.exports = preSaveHook
