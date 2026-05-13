const Sequelize = require('sequelize');
const db = require('../../config/db_sequelize');

const Usuario = db.define('Usuario', {
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    login: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },

    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }

});

module.exports = Usuario;