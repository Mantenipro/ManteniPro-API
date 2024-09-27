import mongoose from 'mongoose';

const modelName = 'userPerfil'; 

const userPerfilSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 12
    },
    role: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    
});

module.exports = mongoose.model(modelName, userPerfilSchema)