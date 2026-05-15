const Usuario = require('../models/relational/Usuario');
const { Habilidade, Categoria } = require('../models/relational');

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
          isAdmin: usuario.isAdmin
        };

        return res.redirect('/home');
      }

      return res.render('usuario/login', { erro: 'Usuário ou senha inválidos' });
      
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro no servidor ao tentar fazer login');
    }
  },

  async getLogout(req, res) {
    req.session.destroy();
    return res.redirect('/home');
  },

  async createUsuario(req, res) {
    try {
      const { login, senha, isAdmin } = req.body;

      if (!login || !senha) {
        return res.status(400).send('Login e senha são obrigatórios');
      }

      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        return res.status(400).send('Este login já está em uso');
      }

      const eAdministrador = isAdmin === 'on' || isAdmin === true;

      await Usuario.create({
        login,
        senha,
        isAdmin: eAdministrador
      });

      return res.redirect('/usuario');

    } catch (err) {
      console.error(err);
      return res.status(500).send('Erro no servidor ao criar usuário');
    }
  },

  async getUsuarios(req, res) {
    try {
      const [usuariosRaw, habilidadesRaw, categoriasRaw] = await Promise.all([
        Usuario.findAll({ attributes: { exclude: ['senha'] } }),
        Habilidade.findAll(),
        Categoria.findAll()
      ]);

      return res.render('usuario/admin', {
        usuarios: usuariosRaw.map(u => u.get({ plain: true })),
        habilidades: habilidadesRaw.map(h => h.get({ plain: true })),
        categorias: categoriasRaw.map(c => c.get({ plain: true })),
        usuario: req.session.user
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Erro ao carregar o painel administrativo.');
    }
  },

    async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const { login, isAdmin } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado.');
            }

            await usuario.update({
                login: login || usuario.login,
                isAdmin: isAdmin !== undefined ? isAdmin : usuario.isAdmin
            });

            return res.status(200).json({ 
                mensagem: 'Usuário atualizado com sucesso!'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
        }
    },

    async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).send('Usuário não encontrado.');
            }

            if (usuario.id === req.session.user.id) {
                return res.status(400).send('Você não pode excluir sua própria conta de administrador.');
            }

            await usuario.destroy();

            return res.redirect('/usuario');
        } catch (error) {
            return res.status(500).send('Erro ao excluir usuário.');
        }
    },

    renderLogin(req, res) {
      if (req.session.user) {
          return res.redirect('/home');
      }
      return res.render('usuario/login');
  }
};