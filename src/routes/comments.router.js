/* eslint-disable no-undef */
// routes/comments.js
const express = require('express')
const router = express.Router()
const { getAllComments, addComment } = require('../usecases/comments.usecase')

// Ruta para obtener todos los comentarios del reporte creado por un usuario específico
router.get('/', async (req, res) => {
  const { userId, reportId } = req.query
  try {
    const comments = await getAllComments(userId, reportId)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Ruta para agregar un nuevo comentario con el usuario correcto
router.post('/', async (req, res) => {
  const { userId, reportId } = req.query
  try {
    const newComment = await addComment(req.body, userId, reportId)
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router