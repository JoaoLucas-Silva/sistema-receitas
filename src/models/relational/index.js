const Usuario = require('./Usuario');
const Receita = require('./Receita');
const Categoria = require('./Categoria');
const Habilidade = require('./Habilidade');
const UsuarioHabilidade = require('./UsuarioHabilidade');

// Usuario ↔ Habilidade (nível)
Usuario.belongsToMany(Habilidade, {
    through: UsuarioHabilidade,
    foreignKey: 'UsuarioId',
    otherKey: 'HabilidadeId'
});

Habilidade.belongsToMany(Usuario, {
    through: UsuarioHabilidade,
    foreignKey: 'HabilidadeId',
    otherKey: 'UsuarioId'
});

// relacionamentos
Receita.belongsToMany(Categoria, { through: 'ReceitaCategoria' });
Categoria.belongsToMany(Receita, { through: 'ReceitaCategoria' });

Receita.belongsToMany(Usuario, { through: 'ReceitaUsuario' });
Usuario.belongsToMany(Receita, { through: 'ReceitaUsuario' });

module.exports = {
    Usuario,
    Receita,
    Categoria,
    Habilidade,
    UsuarioHabilidade
};