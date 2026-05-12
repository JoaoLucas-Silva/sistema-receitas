const Sequelize = require('sequelize');
const db = require('../../config/db_sequelize');

const ReceitaUsuario = db.define('ReceitaUsuario', {

    criador: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

});

module.exports = ReceitaUsuario;