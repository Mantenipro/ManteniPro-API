/* eslint-disable no-undef */
const mongoose = require("mongoose");
const Counter = require('./counter.model'); // Asegúrate de ajustar la ruta según tu estructura de proyecto

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Cambiar a ObjectId
    ref: 'userPerfil', // Referencia al modelo 'User'
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId, // Cambiar a ObjectId
    ref: 'Company', // Referencia al modelo 'Company'
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId, // Nueva propiedad para ObjectId
    ref: 'Equipment', // Referencia al modelo 'Equipment'
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil'
  },
  closeTicketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseTicket'
  },
  orderNumber: {
    type: Number,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  assigned_at: {
    type: Date,
    default: null
  },
  closed_at: {
    type: Date,
    default: null
  },
  time_open_static: {
    type: String, // Guardamos el tiempo como cadena (HH:MM:SS)
    default: null,
  },
  status: {
    type: String,
    required: false,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['Baja', 'Media', 'Alta', 'Sin Prioridad'],
    default: 'Sin Prioridad'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

// Campo virtual para calcular el tiempo abierto
reportSchema.virtual('timeOpen').get(function () {
  if (this.time_open_static) {
    // Si el tiempo ya está calculado, devuelve el valor almacenado.
    return this.time_open_static
  }

  // Si no, calcula dinámicamente.
  const now = new Date()
  const createdAt = this.created_at
  const assignedAt = this.assigned_at

  const diff = assignedAt ? assignedAt - createdAt : now - createdAt

  const hours = Math.floor(diff / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
})

// Campo virtual para calcular el tiempo asignado
reportSchema.virtual('timeAssigned').get(function () {
  if (!this.assigned_at) return null

  const now = new Date()
  const assignedAt = this.assigned_at
  const closedAt = this.closed_at

  const diff = closedAt ? closedAt - assignedAt : now - assignedAt

  const hours = Math.floor(diff / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
})

// Campo virtual para calcular el tiempo cerrado
reportSchema.virtual('timeClosed').get(function () {
  if (!this.closed_at) return null

  const closedAt = this.closed_at
  const diff = new Date() - closedAt

  const hours = Math.floor(diff / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
})

// Campo virtual para calcular el tiempo total
reportSchema.virtual('totalTime').get(function () {
  const createdAt = this.created_at
  const closedAt = this.closed_at

  const diff = closedAt ? closedAt - createdAt : new Date() - createdAt

  const hours = Math.floor(diff / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
})

reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });


reportSchema.pre('save', async function (next) {
  const doc = this
  if (doc.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'reportId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
      doc.orderNumber = counter.seq
      return next()
    } catch (error) {
      next(error)
    }
  } 

  if (!doc.isNew && !doc.time_open_static && doc.assigned_at) {
    // Si el reporte pasa a estar asignado, calcula `time_open_static`.
    const diff = doc.assigned_at - doc.created_at

    const hours = Math.floor(diff / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0')
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0')

    doc.time_open_static = `${hours}:${minutes}:${seconds}`
    return next()
  }

  next()
})

const Report = mongoose.model('Reports', reportSchema);
module.exports = Report;
