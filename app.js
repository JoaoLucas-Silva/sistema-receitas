require('dotenv').config();
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        multiply: (a, b) => a * b,

        ifIn: (id, list, options) => {
          if (!list) return options.inverse(this);
          const exists = list.some(item => item.id === id);
          return exists ? options.fn(this) : options.inverse(this);
      },

      formatDate: (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            });
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// conexão com os bancos
const db = require('./src/config/db_sequelize');
require('./src/config/db_mongoose');

// importa as config do banco
require('./src/models/relational');

// sincronizar tudo de uma vezn
db.sync({alter: true})
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

app.use((req, res, next) => {
    res.locals.usuario = req.session.user || null;
    next();
});

const routes = require('./src/routers/routes');
app.use(routes);

app.listen(8081, () => {
    console.log('Servidor rodando em http://localhost:8081');
});