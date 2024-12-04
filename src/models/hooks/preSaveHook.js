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

      const activationLink = `https://www.mantenipro.net/activate?token=${token}`
      const transporter = await createTransporter()
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: this.email,
        subject: 'Activación de tu cuenta',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Activación de Cuenta</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              .outer-table {
                width: 100%;
                background-color: #232c48; /* Color de fondo sólido */
                padding: 40px 20px;
                text-align: center;
              }
              .inner-table {
                background-color: #ffffff;
                color: #333;
                border-radius: 8px;
                padding: 30px;
                width: 80%;
                max-width: 600px;
                margin: 0 auto;
                position: relative; /* Necesario para posicionar el logo absolutamente dentro de este contenedor */
              }
              h1 {
                font-size: 28px;
                color: #4361b2;
                margin-bottom: 20px;
              }
              p {
                font-size: 16px;
                margin-bottom: 15px;
                line-height: 1.5;
              }
              .highlight {
                font-weight: bold;
                color: #4361b2;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
              }
              .footer strong {
                color: #4361b2;
              }
              .signature {
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                color: #232c48;
              }
              .logo {
                position: absolute; /* Posiciona el logo de forma absoluta */
                bottom: 20px; /* Ajusta la distancia desde la parte inferior */
                right: 20px; /* Ajusta la distancia desde el lado derecho */
                max-width: 150px; /* Ajusta el tamaño del logo */
              }
              a {
                color: #4361b2;
                text-decoration: none;
                font-weight: bold;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <table class="outer-table" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <table class="inner-table" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h1>Gracias por registrarte.</h1>
                        <p>Tu código de activación es: <span class="highlight">${activationCode}</span>.</p>
                        <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>
                        <p><a href="${activationLink}">Activar Cuenta</a></p>
                        <p class="footer">Atentamente, <br> ManteniPro</p>
                      </td>
                    </tr>
                    <!-- Logo en la parte inferior derecha -->
                    <tr>
                      <td>
                        <img src="https://mantenipro.s3.us-east-2.amazonaws.com/logo.png" alt="Mantenipro Logo" class="logo">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      }

      await transporter.sendMail(mailOptions)

      this.activationCodeHash = await hashActivationCode(activationCode)
      this.activationCodeExpiration = moment().add(1, 'hours').toDate()

      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
}

module.exports = preSaveHook
