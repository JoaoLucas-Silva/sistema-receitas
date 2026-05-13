const {
    Receita,
    Categoria,
    Usuario,
    ReceitaUsuario
} = require('../models/relational');

module.exports = {

    async createReceita(req, res) {

        try {

            const {
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo,
                categorias
            } = req.body;

            const usuarioId = req.session.user.id;

            const receita = await Receita.create({
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo
            });

            if (categorias && categorias.length > 0) {

                const categoriasEncontradas = await Categoria.findAll({
                    where: {
                        id: categorias
                    }
                });

                await receita.setCategorias(categoriasEncontradas);
            }

            await ReceitaUsuario.create({
                ReceitaId: receita.id,
                UsuarioId: usuarioId,
                criador: true
            });

            return res.status(201).json(receita);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao criar receita',
                detalhes: error.message
            });

        }

    },

    async getReceitas(req, res) {

        try {

            const receitas = await Receita.findAll({

                include: [
                    {
                        model: Categoria,
                        through: { attributes: [] }
                    },
                    {
                        model: Usuario,
                        through: {
                            attributes: ['criador']
                        }
                    }
                ]

            });

            return res.status(200).json(receitas);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao buscar receitas',
                detalhes: error.message
            });

        }

    },

    async getReceitaById(req, res) {

        try {

            const { id } = req.params;

            const receita = await Receita.findByPk(id, {

                include: [
                    {
                        model: Categoria,
                        through: { attributes: [] }
                    },
                    {
                        model: Usuario,
                        through: {
                            attributes: ['criador']
                        }
                    }
                ]

            });

            if (!receita) {

                return res.status(404).json({
                    erro: 'Receita não encontrada'
                });

            }

            return res.status(200).json(receita);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao buscar receita',
                detalhes: error.message
            });

        }

    },

    async updateReceita(req, res) {

        try {

            const { id } = req.params;

            const {
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo,
                categorias
            } = req.body;

            const receita = await Receita.findByPk(id);

            if (!receita) {

                return res.status(404).json({
                    erro: 'Receita não encontrada'
                });

            }

            await receita.update({
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo
            });

            if (categorias) {

                const categoriasEncontradas = await Categoria.findAll({
                    where: {
                        id: categorias
                    }
                });

                await receita.setCategorias(categoriasEncontradas);

            }

            return res.status(200).json(receita);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao atualizar receita',
                detalhes: error.message
            });

        }

    },

    async deleteReceita(req, res) {

        try {

            const { id } = req.params;

            const receita = await Receita.findByPk(id);

            if (!receita) {

                return res.status(404).json({
                    erro: 'Receita não encontrada'
                });

            }

            await receita.destroy();

            return res.status(200).json({
                mensagem: 'Receita removida com sucesso'
            });

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao remover receita',
                detalhes: error.message
            });

        }

    },

    async addCoautor(req, res) {
        try {
            const { receitaId, alunoId } = req.body;

            const receita = await Receita.findByPk(receitaId);
            if (!receita) return res.status(404).send('Receita não encontrada.');

            await ReceitaUsuario.create({
                ReceitaId: receitaId,
                UsuarioId: alunoId,
                criador: false
            });

            return res.status(201).send('Coautor adicionado com sucesso!');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao adicionar coautor', detalhes: error.message });
        }
    },

    async removeCoautor(req, res) {
        try {
            const { receitaId, alunoId } = req.params;

            const vinculo = await ReceitaUsuario.findOne({
                where: { ReceitaId: receitaId, UsuarioId: alunoId }
            });

            if (!vinculo) return res.status(404).send('Vínculo não encontrado.');
            
            if (vinculo.criador) return res.status(403).send('Não é possível remover o criador da receita.');

            await vinculo.destroy();
            return res.status(200).send('Coautor removido com sucesso.');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao remover coautor' });
        }
    }

};