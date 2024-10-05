const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    idReport: {
        type: String,
        required: true 
    },
    assignedTo: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ['Baja', 'Media', 'Alta'],
        required: true
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;



