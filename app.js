require('dotenv').config();
const express = require('express');
const app = express();

// conexão com os bancos
const db = require('./src/config/db_sequelize');
require('./src/config/db_mongoose');

// importa as config do banco
require('./src/models/relational');

// sincronizar tudo de uma vez
db.sync()
  .then(() => console.log('Banco Postgres sincronizado com sucesso'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Servidor rodando');
});

const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000 // 30 minutos
  }
}));

const routes = require('./src/routers/routes');
app.use(routes);

app.listen(8081, () => {
    console.log('Servidor rodando em http://localhost:8081');
});