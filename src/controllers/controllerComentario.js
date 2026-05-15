const Comentario = require('../models/noSql/Comentario'); 

module.exports = {

    async addComentario(req, res) {
        try {
            const { receitaId } = req.params;
            const { texto } = req.body;
            
            const usuarioLogin = req.session.user.login; 

            await Comentario.create({
                receitaId,
                usuarioLogin,
                texto
            });

            return res.redirect(`/receita/${receitaId}`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Erro ao adicionar comentário');
        }
    },

    async getComentarios(req, res) {
        try {
            const { receitaId } = req.params;

            const comentarios = await Comentario.find({ receitaId: receitaId }).sort({ createdAt: -1 });

            return res.status(200).json(comentarios);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao buscar comentários', detalhes: error.message });
        }
    }
};