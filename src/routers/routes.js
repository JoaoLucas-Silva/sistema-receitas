const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const controllerUsuario = require('../controllers/controllerUsuario');
const controllerCategoria = require('../controllers/controllerCategoria');

router.post('/login', controllerUsuario.postLogin);
router.get('/logout', controllerUsuario.getLogout);

router.get('/home', auth.isAuthenticated, (req, res) => {
  return res.send('Bem-vindo!');
});

router.post('/categoria', controllerCategoria.createCategoria);
router.get('/categoria', controllerCategoria.getCategorias);
router.get('/categoria/:id', controllerCategoria.getCategoriaById);
router.put('/categoria/:id', controllerCategoria.updateCategoria);
router.delete('/categoria/:id', controllerCategoria.deleteCategoria);

module.exports = router;