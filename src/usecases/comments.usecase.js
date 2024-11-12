/* eslint-disable no-undef */
// usecases/commentsUsecase.js
const Comment = require('../models/comments.model')

// Función para obtener todos los comentarios de un usuario específico y un reporte específico
async function getAllComments(userId, reportId) {
  try {
    const comments = await Comment.find({ author: userId, report: reportId })
      .populate({
        path: 'report',
        model: 'Reports' // Asegúrate de que el nombre del modelo sea correcto
      })
      .populate('author')
    return comments
  } catch (error) {
    throw new Error('Error al obtener los comentarios: ' + error.message)
  }
}

// Función para agregar un nuevo comentario con el usuario correcto
async function addComment(commentData, userId, reportId) {
  try {
    const newComment = new Comment({
      ...commentData,
      author: userId,
      report: reportId
    })
    await newComment.save()

    return newComment
  } catch (error) {
    throw new Error('Error al agregar el comentario: ' + error.message)
  }
}

module.exports = {
  getAllComments,
  addComment
}
