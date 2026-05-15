const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const controllerUsuario = require('../controllers/controllerUsuario');
const controllerCategoria = require('../controllers/controllerCategoria');
const controllerReceita = require('../controllers/controllerReceita');
const controllerHabilidade = require('../controllers/controllerHabilidade');
const controllerComentario = require('../controllers/controllerComentario');

router.get('/home', controllerReceita.getReceitas);

router.get('/login', controllerUsuario.renderLogin);
router.post('/login', controllerUsuario.postLogin);
router.get('/logout', controllerUsuario.getLogout);

router.get('/usuario', auth.isAdmin, controllerUsuario.getUsuarios);
router.post('/usuario', auth.isAdmin, controllerUsuario.createUsuario);
router.put('/usuario/:id', auth.isAdmin, controllerUsuario.updateUsuario);
router.delete('/usuario/:id', auth.isAdmin, controllerUsuario.deleteUsuario);

router.get('/meu-perfil', auth.isAuthenticated, controllerHabilidade.renderPerfil);
router.post('/meu-perfil/habilidade', auth.isAuthenticated, controllerHabilidade.addHabilidadeAoPerfil);
router.delete('/meu-perfil/habilidade/:id', auth.isAuthenticated, controllerHabilidade.removeHabilidadeDoPerfil);

router.get('/categoria', controllerCategoria.getCategorias);
router.get('/categoria/:id', controllerCategoria.getCategoriaById);
router.post('/categoria', auth.isAdmin, controllerCategoria.createCategoria);
router.put('/categoria/:id', auth.isAdmin, controllerCategoria.updateCategoria);
router.delete('/categoria/:id', auth.isAdmin, controllerCategoria.deleteCategoria);

router.get('/receita', controllerReceita.getReceitas);
router.get('/receita/cadastrar', auth.isAuthenticated, controllerReceita.renderCadastrar); 
router.get('/receita/categoria/:categoriaId', controllerReceita.getReceitasByCategoria);
router.get('/receita/editar/:id', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.renderEditar);
router.get('/receita/:id', controllerReceita.getReceitaById);
router.post('/receita', auth.isAuthenticated, controllerReceita.createReceita);
router.put('/receita/:id', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.updateReceita);
router.delete('/receita/:id', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.deleteReceita);
router.post('/receita/:id/coautor', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.addCoautor);
router.delete('/receita/:receitaId/coautor/:alunoId', auth.isAuthenticated, auth.canManageRecipe, controllerReceita.removeCoautor);

router.get('/habilidade', auth.isAuthenticated, controllerHabilidade.getHabilidades); 
router.post('/habilidade', auth.isAdmin, controllerHabilidade.createHabilidade);
router.put('/habilidade/:id', auth.isAdmin, controllerHabilidade.updateHabilidade);
router.delete('/habilidade/:id', auth.isAdmin, controllerHabilidade.deleteHabilidade);
router.get('/relatorio/habilidades', controllerHabilidade.getRelatorioHabilidades);

router.get('/receita/:receitaId/comentario', controllerComentario.getComentarios);
router.post('/receita/:receitaId/comentario', auth.isAuthenticated, controllerComentario.addComentario);

module.exports = router;