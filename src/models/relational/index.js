const Usuario = require('./Usuario');
const Receita = require('./Receita');
const Categoria = require('./Categoria');
const Habilidade = require('./Habilidade');
const UsuarioHabilidade = require('./UsuarioHabilidade');
const ReceitaUsuario = require('./ReceitaUsuario');

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

// Receita ↔ Usuario (Criador)
Receita.belongsToMany(Usuario, {
    through: ReceitaUsuario,
    foreignKey: 'ReceitaId',
    otherKey: 'UsuarioId',
    as: 'Usuarios'
});
Usuario.belongsToMany(Receita, {
    through: ReceitaUsuario,
    foreignKey: 'UsuarioId',
    otherKey: 'ReceitaId',
    as: 'Receitas'
});

// relacionamentos
Receita.belongsToMany(Categoria, { 
    through: 'ReceitaCategoria',
    as: 'categorias'
});

Categoria.belongsToMany(Receita, { 
    through: 'ReceitaCategoria',
    as: 'receitas'
});

module.exports = {
    Usuario,
    Receita,
    Categoria,
    Habilidade,
    UsuarioHabilidade,
    ReceitaUsuario
};