const Sequelize = require('sequelize');
const db = require('../../config/db_sequelize');

const Receita = db.define('Receita', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },

    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    link: {
        type: Sequelize.STRING,
        allowNull: true
    }

});

module.exports = Receita;