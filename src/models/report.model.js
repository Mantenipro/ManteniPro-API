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
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    finished_at: {
        type: Date,
        default: null, 
    }
});

const Report = mongoose.model('Reports', reportSchema);
module.exports = Report;