const Sequelize = require('sequelize');
const db = require('../../config/db_sequelize');

const Categoria = db.define('Categoria', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }

});

module.exports = Categoria;