const Usuario = require('../models/relational/Usuario'); // Mantive o seu caminho original

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

        return res.send('Login realizado com sucesso');
      }

      return res.status(401).send('Login ou senha inválidos');
        
    } catch (err) {
      console.error(err);
      return res.status(500).send('Erro no servidor ao tentar fazer login');
    }
  },

  async getLogout(req, res) {
    req.session.destroy();
    return res.send('Logout realizado');
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

      const novoUsuario = await Usuario.create({
        login,
        senha,
        isAdmin: isAdmin || false
      });

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        usuario: {
            id: novoUsuario.id,
            login: novoUsuario.login,
            isAdmin: novoUsuario.isAdmin
        }
      });

    } catch (err) {
      console.error(err);
      return res.status(500).send('Erro no servidor ao criar usuário');
    }
  },

  async getUsuarios(req, res) {
        try {
            const usuarios = await Usuario.findAll({
                attributes: { exclude: ['senha'] }
            });
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao listar usuários.' });
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
                mensagem: 'Usuário atualizado com sucesso!', 
                usuario: {
                    id: usuario.id,
                    login: usuario.login,
                    isAdmin: usuario.isAdmin
                }
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
            return res.status(200).send('Usuário removido com sucesso.');
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
        }
    }

};