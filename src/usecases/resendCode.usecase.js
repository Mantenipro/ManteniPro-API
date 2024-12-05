/* eslint-disable no-undef */
const createError = require('http-errors');
const users = require('../models/user.created.perfil');
const jwt = require('../lib/jwt');
const { createTransporter } = require('../utils/mailUtils');
const {
  generateActivationCode,
  hashActivationCode,
} = require('../utils/tokenUtils');
const moment = require('moment');

async function resendActivationCode(email) {
  // Verificar si el email existe en la base de datos
  const user = await users.findOne({ email }).populate('formRegister');

  if (!user) {
    // Lanzar un error 404 si el email no se encuentra
    throw createError(404, 'Email no encontrado');
  }

  // Generar un nuevo código de activación
  const activationCode = generateActivationCode();

  // Actualizar el usuario con el nuevo código de activación y la nueva fecha de expiración
  if (user.role === 'admin') {
    user.formRegister.activationCodeHash = await hashActivationCode(activationCode);
    user.formRegister.activationCodeExpiration = moment()
      .add(1, 'hours')
      .toDate();
    await user.formRegister.save();
  } else {
    user.activationCodeHash = await hashActivationCode(activationCode);
    user.activationCodeExpiration = moment().add(1, 'hours').toDate();
    await user.save();
  }

  // Generar el token JWT
  const tokenPayload =
    user.role === 'admin' ? { id: user.formRegister.id } : { id: user._id };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const activationPath = user.role === 'admin' ? 'activate' : 'userActivate';
  const activationLink = `https://www.mantenipro.net/${activationPath}?token=${token}`;
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reenvío de código de activación',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
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
            font-size: 24px;
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
            color: #777;
          }
          .logo {
            position: absolute;
            bottom: 20px;
            right: 20px;
            max-width: 100px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4361b2;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
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
                    <h1>Hola, ${user.role === 'admin' ? 'Administrador' : 'Usuario'}</h1>
                    <p>Hemos generado un nuevo código de activación para tu cuenta.</p>
                    <p><span class="highlight">Código de activación:</span> ${activationCode}</p>
                    <p>Este código expira en <span class="highlight">1 hora</span>.</p>
                    <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
                    <a href="${activationLink}" class="button">Activar Cuenta</a>
                    <p class="footer">Si no solicitaste este código, ignora este mensaje.</p>
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
    `,
  };

  await transporter.sendMail(mailOptions);

  return { message: 'Código de activación reenviado' };
}

module.exports = {
  resendActivationCode,
};
