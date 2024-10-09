/* eslint-disable no-undef */
const userPerfil = require('../user.created.perfil')

async function postSaveHook(doc) {
  process.nextTick(async () => {
    try {
      const existingUser = await userPerfil.findOne({ email: doc.email })

      if (existingUser) {
        console.error(`El correo ${doc.email} ya tiene un perfil creado.`)
        return
      }

      const perfilData = {
        name: doc.fullname,
        lastname: 'defaultLastname',
        email: doc.email,
        password: doc.password,
        role: 'defaultRole',
        type: 'defaultType',
        photo: 'defaultPhoto'
      }

      try {
        await userPerfil.create(perfilData)
        console.log('Perfil de usuario creado con éxito.')
      } catch (error) {
        if (error.code === 11000) {
          console.error(
            `Error: El correo ${perfilData.email} ya está registrado como perfil.`
          )
        } else if (error.name === 'ValidationError') {
          console.error(
            'Error de validación al crear el perfil:',
            error.message
          )
        } else {
          console.error(
            'Error inesperado al crear el perfil del usuario:',
            error
          )
        }
      }
    } catch (error) {
      console.error('Error en el post-save hook:', error)
    }
  })
}

module.exports = postSaveHook
