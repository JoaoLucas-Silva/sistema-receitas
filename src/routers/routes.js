const express = require('express');
const router = express.Router();

const controllerUsuario = require('../controllers/controllerUsuario');

router.post('/login', controllerUsuario.postLogin);
router.get('/logout', controllerUsuario.getLogout);

const auth = require('../middlewares/auth');

router.get('/home', auth.isAuthenticated, (req, res) => {
  return res.send('Bem-vindo!');
});

module.exports = router;