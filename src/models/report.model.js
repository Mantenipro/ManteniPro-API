/* eslint-disable no-undef */
const mongoose = require("mongoose");
const Counter = require('./counter.model'); 
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil', 
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userPerfil'
  },
  orderNumber: {
    type: Number,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  finished_at: {
    type: Date,
    default: null
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
reportSchema.virtual('timeOpen').get(function() {
    const now = new Date();
    const createdAt = this.created_at;
    const diff = now - createdAt;

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
});

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
      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
})

const Report = mongoose.model('Reports', reportSchema);
module.exports = Report;
