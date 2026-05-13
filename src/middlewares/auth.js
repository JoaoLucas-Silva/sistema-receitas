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
  }

};