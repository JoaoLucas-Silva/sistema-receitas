const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const controllerUsuario = require('../controllers/controllerUsuario');
const controllerCategoria = require('../controllers/controllerCategoria');
const controllerReceita = require('../controllers/controllerReceita');

router.post('/login', controllerUsuario.postLogin);
router.get('/logout', controllerUsuario.getLogout);
router.post('/usuario', auth.isAdmin, controllerUsuario.createUsuario);

router.get('/home', auth.isAuthenticated, (req, res) => {
  return res.send('Bem-vindo!');
});

router.post('/categoria', controllerCategoria.createCategoria);
router.get('/categoria', controllerCategoria.getCategorias);
router.get('/categoria/:id', controllerCategoria.getCategoriaById);
router.put('/categoria/:id', controllerCategoria.updateCategoria);
router.delete('/categoria/:id', controllerCategoria.deleteCategoria);

router.post(
    '/receita',
    auth.isAuthenticated,
    controllerReceita.createReceita
);
router.get(
    '/receita',
    controllerReceita.getReceitas
);
router.get(
    '/receita/:id',
    controllerReceita.getReceitaById
);
router.put(
    '/receita/:id',
    auth.isAuthenticated,
    controllerReceita.updateReceita
);
router.delete(
    '/receita/:id',
    auth.isAuthenticated,
    controllerReceita.deleteReceita
);

module.exports = router;