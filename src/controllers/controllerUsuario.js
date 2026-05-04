const Usuario = require('../models/relational/Usuario');

module.exports = {

  async postLogin(req, res) {

    try {

      const { login, senha } = req.body;

      const usuario = await Usuario.findOne({
        where: { login, senha }
      });

      if (usuario) {
        req.session.user = {
          id: usuario.id,
          login: usuario.login,
          tipo: usuario.tipo
        };

        return res.send('Login realizado com sucesso');
      }

      return res.status(401).send('Login inválido');
        
    } catch (err) {
      console.error(err);
      return res.status(500).send('Erro no servidor');
    }
  },

  async getLogout(req, res) {
    req.session.destroy();
    res.send('Logout realizado');
  }
};