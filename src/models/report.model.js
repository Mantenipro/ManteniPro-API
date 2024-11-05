/* eslint-disable no-undef */
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Cambiar a ObjectId
        ref: 'User', // Referencia al modelo 'User'
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId, // Cambiar a ObjectId
        ref: 'Company', // Referencia al modelo 'Company'
        required: true,
    },
    equipment: {
        type: mongoose.Schema.Types.ObjectId, // Nueva propiedad para ObjectId
        ref: 'Equipment', // Referencia al modelo 'Equipment'
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    finished_at: {
        type: Date,
        default: null, 
    },
    status: {
        type: String, 
        required: false, 
        enum: ['pending', 'in-progress', 'completed', 'archived'], 
        default: 'pending',
    }
});

const Report = mongoose.model('Reports', reportSchema);
module.exports = Report;
