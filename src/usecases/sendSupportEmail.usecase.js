/* eslint-disable no-undef */
const { createTransporter } = require('../utils/mailUtils')
const SupportTT = require('../models/support.model')
const { v4: uuidv4 } = require('uuid')

const sendSupportEmail = async ({ name, email, message }) => {
  // Generar un código único para el ticket
  const ticketId = uuidv4()

  const newTicket = await SupportTT.create({
    ticketId,
    name,
    email,
    message
  })

  try {
    const transporter = await createTransporter()

    // Correo al equipo de soporte
    const supportMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      subject: `Nuevo mensaje de soporte: Ticket ${ticketId}`,
      html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .outer-table {
              width: 100%;
              background-color: #232c48;
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
              position: relative;
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
              position: absolute;
              bottom: 20px;
              right: 20px;
              max-width: 150px;
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
                      <h1>Nuevo mensaje de soporte: Ticket ${ticketId}</h1>
                      <p><span class="highlight">Nombre:</span> ${name}</p>
                      <p><span class="highlight">Email:</span> ${email}</p>
                      <p><span class="highlight">Mensaje:</span> ${message}</p>
                      <p><span class="highlight">Código de Ticket:</span> ${ticketId}</p>
                      <p>Gracias por ponerte en contacto con nuestro equipo de soporte. Estamos trabajando en tu caso y te responderemos lo antes posible.</p>
                      <p class="footer">Atentamente, <br> El equipo de soporte</p>
                    </td>
                  </tr>
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

    await transporter.sendMail(supportMailOptions)

    // Correo de confirmación al usuario
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Hemos recibido tu mensaje - Ticket ${ticketId}`,
      html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .outer-table {
              width: 100%;
              background-color: #232c48;
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
              position: relative;
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
              position: absolute;
              bottom: 20px;
              right: 20px;
              max-width: 150px;
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
                      <h1>Hola ${name},</h1>
                      <p>Hemos recibido tu mensaje y nuestro equipo de soporte está trabajando en ello.</p>
                      <p>Por favor, utiliza este correo si necesitas contactarnos nuevamente sobre este asunto.</p>
                      <p>Gracias por ponerte en contacto con nosotros.</p>
                      <p class="footer">Atentamente, <br> El equipo de soporte</p>
                    </td>
                  </tr>
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

    await transporter.sendMail(userMailOptions)

    return { ticketId } // Retorna el ID del ticket para su uso posterior
  } catch (error) {
    //console.error('Error al enviar correos:', error)
    throw new Error('No se pudo enviar el correo.')
  }
}

module.exports = { sendSupportEmail }
