const Sequelize = require('sequelize');
const db = require('../../config/db_sequelize');

const UsuarioHabilidade = db.define('UsuarioHabilidade', {

    nivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10
        }
    }

});

module.exports = UsuarioHabilidade;