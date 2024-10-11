/* eslint-disable no-undef */
const userPerfil = require('../user.created.perfil')
const Company = require('../companies.model') // Cambié "company" a "Company"

async function postSaveHook(doc) {
  process.nextTick(async () => {
    try {
      // Verifica si el usuario ya tiene un perfil creado
      const existingUser = await userPerfil.findOne({ email: doc.email })

      if (existingUser) {
        console.error(`El correo ${doc.email} ya tiene un perfil creado.`)
        return
      }

      // Datos para el perfil del usuario
      const perfilData = {
        name: doc.fullname,
        lastname: 'defaultLastname',
        email: doc.email,
        password: doc.password,
        role: 'defaultRole',
        type: 'defaultType',
        photo: 'defaultPhoto'
      }

      // Guarda el nuevo perfil de usuario
      const newUserPerfil = new userPerfil(perfilData)
      await newUserPerfil.save()
      console.log('Perfil de usuario creado con éxito.')

      // Datos para la empresa
      const companyData = {
        name: doc.companyName,
        email: doc.email,
        password: doc.password,
        address: 'defaultRole',
        status: doc.status
      }

      // Guarda la nueva compañía
      const newCompany = new Company(companyData)
      await newCompany.save()
      console.log('Compañía creada con éxito.')
    } catch (error) {
      console.error('Error en el post-save hook:', error)
    }
  })
}

module.exports = postSaveHook
