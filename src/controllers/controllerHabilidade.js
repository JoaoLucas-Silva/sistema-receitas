const Habilidade = require('../models/relational/Habilidade');
const Usuario = require('../models/relational/Usuario');
const Receita = require ('../models/relational/Receita');

module.exports = {

    async renderPerfil(req, res) {
    try {
        const usuarioId = req.session.user.id;

        const usuarioCompleto = await Usuario.findByPk(usuarioId, {
            include: [
                { 
                    model: Habilidade, 
                    through: { attributes: ['nivel'] } 
                },
                {
                    model: require('../models/relational/Receita'), 
                    as: 'Receitas',
                    include: {
                        model: require('../models/relational/Categoria'),
                        as: 'categorias',
                        through: { attributes: [] }
                    }
                }
            ]
        });

        if (!usuarioCompleto) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const todasHabilidades = await Habilidade.findAll();

        const minhasHabilidades = usuarioCompleto.Habilidades 
            ? usuarioCompleto.Habilidades.map(h => h.get({ plain: true })) 
            : [];
            
        const minhasReceitas = usuarioCompleto.Receitas 
            ? usuarioCompleto.Receitas.map(r => r.get({ plain: true })) 
            : [];

        return res.render('usuario/perfil', {
            usuario: req.session.user,
            minhasHabilidades,
            minhasReceitas,
            catalogoHabilidades: todasHabilidades.map(h => h.get({ plain: true }))
        });

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        return res.status(500).send("Erro ao carregar o perfil.");
    }
},

    async addHabilidadeAoPerfil(req, res) {
        try {
            const usuarioId = req.session.user.id;
            const { habilidadeId, nivel } = req.body;

            if (nivel < 0 || nivel > 10) {
                return res.redirect('/meu-perfil?erro=nivel');
            }

            const usuario = await Usuario.findByPk(usuarioId);
            const habilidade = await Habilidade.findByPk(habilidadeId);

            if (!habilidade) return res.status(404).send('Habilidade inexistente.');

            await usuario.addHabilidade(habilidade, { through: { nivel: nivel } });

            return res.redirect('/meu-perfil');
        } catch (error) {
            return res.status(500).send("Erro ao salvar habilidade.");
        }
    },

    async removeHabilidadeDoPerfil(req, res) {
        try {
            const usuarioId = req.session.user.id;
            const { id } = req.params;

            const usuario = await Usuario.findByPk(usuarioId);
            const habilidade = await Habilidade.findByPk(id);

            await usuario.removeHabilidade(habilidade);

            return res.redirect('/meu-perfil');
        } catch (error) {
            return res.status(500).send("Erro ao remover habilidade.");
        }
    },

    async createHabilidade(req, res) {
        try {
            const { nome } = req.body;
            await Habilidade.create({ nome });

            return res.redirect('/usuario');
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro ao criar habilidade.");
        }
    },

    async getHabilidades(req, res) {
        try {
            const habilidadesRaw = await Habilidade.findAll();
            const habilidades = habilidadesRaw.map(h => h.get({ plain: true }));
            return res.json(habilidades);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao listar habilidades' });
        }
    },

    async getRelatorioHabilidades(req, res) {
        try {
            const totalAlunos = await Usuario.count({ where: { isAdmin: false } });
            if (totalAlunos === 0) return res.render('categoria/relatorio', { mensagem: "Sem alunos." });

            const habilidades = await Habilidade.findAll({
                include: [{
                    model: Usuario,
                    attributes: ['id'],
                    where: { isAdmin: false },
                    required: false
                }]
            });

            const relatorio = habilidades.map(h => {
                const totalComHabilidade = h.Usuarios.length;
                const proporcao = ((totalComHabilidade / totalAlunos) * 100).toFixed(2);
                
                return {
                    habilidade: h.nome,
                    porcentagem: proporcao,
                    quantidadeAlunos: totalComHabilidade,
                    totalSistema: totalAlunos
                };
            });

            return res.render('categoria/relatorio', { relatorio });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro no relatório.");
        }
    },

    async updateHabilidade(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;
            const habilidade = await Habilidade.findByPk(id);
            if (!habilidade) return res.status(404).send('Habilidade não encontrada.');

            await habilidade.update({ nome });

            return res.redirect('/usuario');
        } catch (error) {
            return res.status(500).send('Erro ao atualizar habilidade');
        }
    },

    async deleteHabilidade(req, res) {
        try {
            const { id } = req.params;
            const habilidade = await Habilidade.findByPk(id);
            if (!habilidade) return res.status(404).send('Habilidade não encontrada.');

            await habilidade.destroy();

            return res.redirect('/usuario');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Erro ao excluir habilidade');
        }
    },
};