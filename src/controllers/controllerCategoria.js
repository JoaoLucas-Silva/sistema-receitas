const Categoria = require('../models/relational/Categoria');

module.exports = {

    async createCategoria(req, res) {
        try {

            const { nome } = req.body;

            const categoria = await Categoria.create({
                nome
            });

            return res.status(201).json(categoria);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao criar categoria',
                detalhes: error.message
            });

        }
    },

    async getCategorias(req, res) {
        try {

            const categorias = await Categoria.findAll();

            return res.status(200).json(categorias);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao buscar categorias',
                detalhes: error.message
            });

        }
    },

    async getCategoriaById(req, res) {
        try {

            const { id } = req.params;

            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).json({
                    erro: 'Categoria não encontrada'
                });
            }

            return res.status(200).json(categoria);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao buscar categoria',
                detalhes: error.message
            });

        }
    },

    async updateCategoria(req, res) {
        try {

            const { id } = req.params;
            const { nome } = req.body;

            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).json({
                    erro: 'Categoria não encontrada'
                });
            }

            await categoria.update({
                nome
            });

            return res.status(200).json(categoria);

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao atualizar categoria',
                detalhes: error.message
            });

        }
    },

    async deleteCategoria(req, res) {
        try {

            const { id } = req.params;

            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).json({
                    erro: 'Categoria não encontrada'
                });
            }

            await categoria.destroy();

            return res.status(200).json({
                mensagem: 'Categoria removida com sucesso'
            });

        } catch (error) {

            return res.status(500).json({
                erro: 'Erro ao remover categoria',
                detalhes: error.message
            });

        }
    }

};