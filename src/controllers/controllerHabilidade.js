const Habilidade = require('../models/relational/Habilidade');
const Usuario = require('../models/relational/Usuario');
const UsuarioHabilidade = require('../models/relational/UsuarioHabilidade');

module.exports = {

    async createHabilidade(req, res) {
        try {
            const { nome } = req.body;
            if (!nome) return res.status(400).send('O nome da habilidade é obrigatório.');

            const habilidade = await Habilidade.create({ nome });
            return res.status(201).json(habilidade);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao criar habilidade', detalhes: error.message });
        }
    },

    async getHabilidades(req, res) {
        try {
            const habilidades = await Habilidade.findAll();
            return res.status(200).json(habilidades);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao listar habilidades' });
        }
    },

    async updateHabilidade(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            const habilidade = await Habilidade.findByPk(id);
            if (!habilidade) return res.status(404).send('Habilidade não encontrada.');

            await habilidade.update({ nome });
            return res.status(200).json(habilidade);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar habilidade' });
        }
    },

    async deleteHabilidade(req, res) {
        try {
            const { id } = req.params;
            const habilidade = await Habilidade.findByPk(id);
            
            if (!habilidade) return res.status(404).send('Habilidade não encontrada.');

            await habilidade.destroy();
            return res.status(200).send('Habilidade excluída com sucesso.');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao excluir habilidade' });
        }
    },

    async addHabilidadeAoPerfil(req, res) {
        try {
            const usuarioId = req.session.user.id;
            const { habilidadeId, nivel } = req.body;

            const usuario = await Usuario.findByPk(usuarioId);
            const habilidade = await Habilidade.findByPk(habilidadeId);

            if (!habilidade) return res.status(404).send('Habilidade não existe no catálogo.');

            await usuario.addHabilidade(habilidade, { through: { nivel: nivel } });

            return res.status(201).send('Habilidade adicionada ao seu perfil!');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao vincular habilidade', detalhes: error.message });
        }
    },

    async removeHabilidadeDoPerfil(req, res) {
        try {
            const usuarioId = req.session.user.id;
            const { id } = req.params;

            const usuario = await Usuario.findByPk(usuarioId);
            const habilidade = await Habilidade.findByPk(id);

            if (!habilidade) return res.status(404).send('Habilidade não encontrada.');

            await usuario.removeHabilidade(habilidade);
            return res.status(200).send('Habilidade removida do seu perfil.');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao remover habilidade' });
        }
    },

    async getRelatorioHabilidades(req, res) {
        try {

            const totalAlunos = await Usuario.count({
                where: { isAdmin: false }
            });

            if (totalAlunos === 0) {
                return res.status(200).json({ mensagem: "Nenhum aluno cadastrado no sistema." });
            }

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
                    quantidadeAlunos: totalComHabilidade,
                    totalSistema: totalAlunos,
                    porcentagem: `${proporcao}%`
                };
            });

            return res.status(200).json(relatorio);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
        }
    }
    
};