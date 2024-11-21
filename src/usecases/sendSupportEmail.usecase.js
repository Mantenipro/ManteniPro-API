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

  console.log('Ticket guardado en la base de datos:', newTicket)

  try {
    const transporter = await createTransporter()
    // Correo al equipo de soporte
    const supportMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      subject: `Nuevo mensaje de soporte: Ticket ${ticketId}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
        <p><strong>Código de Ticket:</strong> ${ticketId}</p>
      `,
    };

    await transporter.sendMail(supportMailOptions);

    // Correo de confirmación al usuario
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Hemos recibido tu mensaje - Ticket ${ticketId}`,
      html: `
        <p>Hola ${name},</p>
        <p>Hemos recibido tu mensaje y nuestro equipo de soporte está trabajando en ello.</p>
        <p>Tu código de ticket es: <strong>${ticketId}</strong>.</p>
        <p>Por favor, utiliza este código si necesitas contactarnos nuevamente sobre este asunto.</p>
        <p>Gracias,</p>
        <p>El equipo de soporte</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    return { ticketId }; // Retorna el ID del ticket para su uso posterior
  } catch (error) {
    console.error('Error al enviar correos:', error);
    throw new Error('No se pudo enviar el correo.');
  }
}

module.exports = { sendSupportEmail }