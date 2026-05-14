const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
    receitaId: { 
        type: Number, 
        required: true
    },
    usuarioLogin: { 
        type: String, 
        required: true
    },
    texto: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);