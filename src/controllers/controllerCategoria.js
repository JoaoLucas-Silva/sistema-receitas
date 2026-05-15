const Categoria = require('../models/relational/Categoria');

module.exports = {

    async createCategoria(req, res) {
        try {
            const { nome } = req.body;

            await Categoria.create({
                nome
            });

            return res.redirect('/usuario');

        } catch (error) {
            console.error(error);
            return res.status(500).send('Erro ao criar categoria');
        }
    },

    async getCategorias(req, res) {
        try {
            const categoriasRaw = await Categoria.findAll();
            const categorias = categoriasRaw.map(c => c.get({ plain: true }));

            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(500).send('Erro ao buscar categorias');
        }
    },

    async getCategoriaById(req, res) {
        try {
            const { id } = req.params;
            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).send('Categoria não encontrada');
            }

            return res.status(200).json(categoria);
        } catch (error) {
            return res.status(500).send('Erro ao buscar categoria');
        }
    },

    async updateCategoria(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).send('Categoria não encontrada');
            }

            await categoria.update({ nome });

            return res.redirect('/usuario');
        } catch (error) {
            return res.status(500).send('Erro ao atualizar categoria');
        }
    },

    async deleteCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoria = await Categoria.findByPk(id);

            if (!categoria) {
                return res.status(404).send('Categoria não encontrada');
            }

            await categoria.destroy();

            return res.redirect('/usuario');

        } catch (error) {
            console.error(error);
            return res.status(500).send('Erro ao remover categoria');
        }
    }
};