const ReceitaUsuario = require('../models/relational/ReceitaUsuario');

module.exports = {

  isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    
    return res.status(401).send('Não autorizado. Faça login primeiro.');
  },

  isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin === true) {
      return next();
    }
    return res.status(403).send('Acesso negado. Apenas administradores podem realizar esta ação.');
  },

  async canManageRecipe(req, res, next) {
    try {
      const usuarioId = req.session.user.id;
      
      const receitaId = req.params.id || req.params.receitaId || req.body.receitaId;

      if (!receitaId) {
        return res.status(400).send('ID da receita não identificado na requisição.');
      }

      if (req.session.user.isAdmin) {
        return next();
      }

      const permissao = await ReceitaUsuario.findOne({
        where: { 
            ReceitaId: receitaId, 
            UsuarioId: usuarioId 
        }
      });

      if (permissao) {
        return next();
      }

      return res.status(403).send('Acesso negado. Você não é responsável por esta receita.');
      
    } catch (error) {
      console.error("Erro no middleware canManageRecipe:", error);
      return res.status(500).send('Erro interno ao verificar permissões.');
    }
  }

};