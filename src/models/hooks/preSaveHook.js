/* eslint-disable no-undef */
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { createTransporter } = require('../../utils/mailUtils')
const {
  generateActivationCode,
  hashActivationCode
} = require('../../utils/tokenUtils')

async function preSaveHook(next) {
  if (this.isNew) {
    try {
      const activationCode = generateActivationCode()

      // Generar el token JWT
      const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })

      const activationLink = `http://localhost:3000/activate?token=${token}`
      const transporter = await createTransporter()
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: this.email,
        subject: 'Activación de tu cuenta',
        html: `<p>Gracias por registrarte. Tu código de activación es: ${activationCode}.</p> 
               <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta: <a href="${activationLink}">Activar Cuenta. </a></p>`
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
