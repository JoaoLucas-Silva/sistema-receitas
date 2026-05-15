const {
    Receita,
    Categoria,
    Usuario,
    ReceitaUsuario
} = require('../models/relational');
const Comentario = require('../models/noSql/Comentario');
const { Op } = require('sequelize');

module.exports = {

    async createReceita(req, res) {
        try {
            const { nome, descricao, link, ingredientes, modoPreparo, categorias } = req.body;
            const usuarioId = req.session.user.id;

            if (!nome || !descricao) {
                return res.render('receita/cadastro-receita', { erro: 'Nome e Descrição são obrigatórios!' });
            }

            const receita = await Receita.create({
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo
            });

            if (categorias) {
                const idsCategorias = Array.isArray(categorias) ? categorias : [categorias];
                const categoriasEncontradas = await Categoria.findAll({
                    where: { id: idsCategorias }
                });
                await receita.setCategorias(categoriasEncontradas);
            }

            await ReceitaUsuario.create({
                ReceitaId: receita.id,
                UsuarioId: usuarioId,
                criador: true
            });

            return res.redirect('/home');
        } catch (error) {
            console.error(error);
            return res.render('receita/cadastro-receita', { erro: 'Erro interno ao criar receita.' });
        }
    },

    async getReceitas(req, res) {
        try {
            const { search } = req.query;
            let whereClause = {};

            if (search) {
                whereClause = {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${search}%` } },
                        { ingredientes: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            const [receitasRaw, categoriasRaw] = await Promise.all([
                Receita.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: Categoria,
                            as: 'categorias',
                            through: { attributes: [] }
                        },
                        {
                            model: Usuario,
                            as: 'Usuarios',
                            attributes: ['id', 'login'],
                            through: { attributes: ['criador'] }
                        }
                    ]
                }),
                Categoria.findAll()
            ]);

            const receitas = receitasRaw.map(r => r.get({ plain: true }));
            const categorias = categoriasRaw.map(c => c.get({ plain: true }));

            return res.render('home', { 
                receitas, 
                categorias,
                titulo: "Confira nossas Receitas",
                usuario: req.session.user,
                search
            });

        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro ao buscar receitas");
        }
    },

    async getReceitasByCategoria(req, res) {
        try {
            const { categoriaId } = req.params;

            const [receitasRaw, categoriasRaw] = await Promise.all([
                Receita.findAll({
                    include: [
                        {
                            model: Categoria,
                            as: 'categorias',
                            where: { id: categoriaId },
                            through: { attributes: [] }
                        },
                        {
                            model: Usuario,
                            as: 'Usuarios',
                            attributes: ['id', 'login']
                        }
                    ]
                }),
                Categoria.findAll()
            ]);

            const receitas = receitasRaw.map(r => r.get({ plain: true }));
            const categorias = categoriasRaw.map(c => c.get({ plain: true }));

            return res.render('home', { 
                receitas, 
                categorias, 
                usuario: req.session.user 
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro ao filtrar por categoria");
        }
    },

    async getReceitaById(req, res) {
        try {
            const { id } = req.params;

            let receitaRaw = await Receita.findByPk(id, {
                include: [
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: Usuario,
                        as: 'Usuarios',
                        attributes: ['id', 'login'],
                        through: { attributes: ['criador'] }
                    }
                ]
            });

            if (!receitaRaw) {
                return res.status(404).send('Receita não encontrada');
            }

            const comentarios = await Comentario.find({ receitaId: id }).lean();

            const receita = receitaRaw.get({ plain: true });
            receita.comentarios = comentarios;

            const eAutor = req.session.user && receita.Usuarios.some(u => u.id === req.session.user.id);

            let usuariosDisponiveis = [];
            if (eAutor) {
                const idsAtuais = receita.Usuarios.map(u => u.id);
                const todosUsuarios = await Usuario.findAll({
                    where: {
                        id: { [Op.notIn]: idsAtuais },
                        isAdmin: false
                    },
                    attributes: ['id', 'login']
                });
                usuariosDisponiveis = todosUsuarios.map(u => u.get({ plain: true }));
            }

            return res.render('receita/detalhes', { 
                receita, 
                eAutor, 
                usuariosDisponiveis, 
                usuario: req.session.user 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro ao buscar detalhes da receita");
        }
    },

    async renderEditar(req, res) {
        try {
            const { id } = req.params;
            const receitaRaw = await Receita.findByPk(id, {
                include: [{ model: Categoria, as: 'categorias' }]
            });

            if (!receitaRaw) return res.status(404).send('Receita não encontrada');

            const categoriasRaw = await Categoria.findAll();
            
            const receita = receitaRaw.get({ plain: true });
            const listaCategorias = categoriasRaw.map(c => c.get({ plain: true }));

            return res.render('receita/editar-receita', {
                receita,
                listaCategorias,
                usuario: req.session.user
            });
        } catch (error) {
            return res.status(500).send("Erro ao carregar tela de edição");
        }
    },

    async updateReceita(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, link, ingredientes, modoPreparo, categorias } = req.body;

            const receita = await Receita.findByPk(id);

            if (!receita) return res.status(404).send('Receita não encontrada');

            await receita.update({
                nome,
                descricao,
                link,
                ingredientes,
                modoPreparo
            });

            if (categorias) {
                const idsCategorias = Array.isArray(categorias) ? categorias : [categorias];
                const categoriasEncontradas = await Categoria.findAll({
                    where: { id: idsCategorias }
                });
                await receita.setCategorias(categoriasEncontradas);
            } else {
                await receita.setCategorias([]);
            }

            return res.redirect(`/receita/${id}`);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro ao atualizar receita");
        }
    },

    async deleteReceita(req, res) {
        try {
            const { id } = req.params;
            const receita = await Receita.findByPk(id);

            if (!receita) return res.status(404).send('Receita não encontrada');

            await receita.destroy();
            return res.redirect('/home');
        } catch (error) {
            return res.status(500).send("Erro ao remover receita");
        }
    },

    async addCoautor(req, res) {
        try {
            const receitaId = req.params.id; 
            const { usuarioId } = req.body; 

            const receita = await Receita.findByPk(receitaId);
            if (!receita) return res.status(404).send('Receita não encontrada.');

            await ReceitaUsuario.create({
                ReceitaId: receitaId,
                UsuarioId: usuarioId,
                criador: false
            });

            return res.redirect(`/receita/${receitaId}`);
        } catch (error) {
            return res.status(500).send("Erro ao adicionar coautor");
        }
    },

    async removeCoautor(req, res) {
        try {
            const { receitaId, alunoId } = req.params;
            const vinculo = await ReceitaUsuario.findOne({
                where: { ReceitaId: receitaId, UsuarioId: alunoId }
            });

            if (!vinculo) return res.status(404).send('Vínculo não encontrado.');
            if (vinculo.criador) return res.status(403).send('Não é possível remover o criador.');

            await vinculo.destroy();
            return res.redirect(`/receita/${receitaId}`);
        } catch (error) {
            return res.status(500).send("Erro ao remover coautor");
        }
    },

    async renderCadastrar(req, res) {
        try {
            const categoriasRaw = await Categoria.findAll();
            const listaCategorias = categoriasRaw.map(c => c.get({ plain: true }));

            return res.render('receita/cadastro-receita', {
                usuario: req.session.user,
                listaCategorias
            });
        } catch (error) {
            return res.status(500).send("Erro ao carregar tela de cadastro");
        }
    }
};