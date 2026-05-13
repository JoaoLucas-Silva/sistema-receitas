const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const controllerUsuario = require('../controllers/controllerUsuario');
const controllerCategoria = require('../controllers/controllerCategoria');
const controllerReceita = require('../controllers/controllerReceita');
const controllerHabilidade = require('../controllers/controllerHabilidade');

router.post('/login', controllerUsuario.postLogin);
router.get('/logout', controllerUsuario.getLogout);
router.post('/usuario', auth.isAdmin, controllerUsuario.createUsuario);
router.get('/usuario', auth.isAdmin, controllerUsuario.getUsuarios);
router.put('/usuario/:id', auth.isAdmin, controllerUsuario.updateUsuario);
router.delete('/usuario/:id', auth.isAdmin, controllerUsuario.deleteUsuario);

router.get('/home', auth.isAuthenticated, (req, res) => {
  return res.send('Bem-vindo!');
});

router.post('/categoria', controllerCategoria.createCategoria);
router.get('/categoria', controllerCategoria.getCategorias);
router.get('/categoria/:id', controllerCategoria.getCategoriaById);
router.put('/categoria/:id', controllerCategoria.updateCategoria);
router.delete('/categoria/:id', controllerCategoria.deleteCategoria);

router.post('/receita', auth.isAuthenticated, controllerReceita.createReceita);
router.get('/receita', controllerReceita.getReceitas);
router.get('/receita/:id', controllerReceita.getReceitaById);
router.post('/receita/coautor', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.addCoautor);
router.delete('/receita/:receitaId/coautor/:alunoId', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.removeCoautor);
router.put('/receita/:id', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.updateReceita);
router.delete('/receita/:id', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.deleteReceita);
router.get('/receita/categoria/:categoriaId', controllerReceita.getReceitasByCategoria);

router.post('/habilidade', auth.isAdmin, controllerHabilidade.createHabilidade);
router.get('/habilidade', auth.isAuthenticated, controllerHabilidade.getHabilidades); 
router.put('/habilidade/:id', auth.isAdmin, controllerHabilidade.updateHabilidade);
router.delete('/habilidade/:id', auth.isAdmin, controllerHabilidade.deleteHabilidade);
router.post('/meu-perfil/habilidade', auth.isAuthenticated, controllerHabilidade.addHabilidadeAoPerfil);
router.delete('/meu-perfil/habilidade/:id', auth.isAuthenticated, controllerHabilidade.removeHabilidadeDoPerfil);
router.get('/relatorio/habilidades', auth.isAuthenticated, controllerHabilidade.getRelatorioHabilidades);

router.post('/habilidade', auth.isAdmin, controllerHabilidade.createHabilidade);
router.get('/habilidade', auth.isAuthenticated, controllerHabilidade.getHabilidades); 
router.put('/habilidade/:id', auth.isAdmin, controllerHabilidade.updateHabilidade);
router.delete('/habilidade/:id', auth.isAdmin, controllerHabilidade.deleteHabilidade);
router.post('/meu-perfil/habilidade', auth.isAuthenticated, controllerHabilidade.addHabilidadeAoPerfil);
router.delete('/meu-perfil/habilidade/:id', auth.isAuthenticated, controllerHabilidade.removeHabilidadeDoPerfil);

module.exports = router;