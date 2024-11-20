/* eslint-disable no-undef */
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reports',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
