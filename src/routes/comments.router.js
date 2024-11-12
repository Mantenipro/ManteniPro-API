/* eslint-disable no-undef */
// routes/comments.js
const express = require('express')
const router = express.Router()
const { getAllComments, addComment } = require('../usecases/comments.usecase')
const auth = require('../middleware/auth.middleware')

// Ruta para obtener todos los comentarios del reporte
router.get('/', async (req, res) => {
  const { reportId } = req.query
  try {
    const comments = await getAllComments(reportId)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Ruta para agregar un nuevo comentario con el usuario correcto
router.post('/', auth, async (req, res) => {
  const { reportId } = req.query
  const userId = req.user.id // Obtener el userId del token autenticado
  try {
    const newComment = await addComment(req.body, userId, reportId)
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router