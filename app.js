// Dépendances native
const path = require('path')

// Dépendances 3rd party
const express = require('express')
const db = require('sqlite')

const methodOverride = require('method-override')
const sass = require('node-sass-middleware')
const mongoose = require('mongoose')
const moment = require('moment')
const bodyParser = require('body-parser')
var session = require('express-session')
// const Session = require('./models/session')
moment.locale('fr')
// Constantes et initialisations
const PORT = process.PORT || 8080
const app = express()

// load the cookie-parsing middleware
var cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/todolist', function(err) {
    if (err) { throw err}
})
// Mise en place des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.moment = require('moment');

// Middleware pour forcer un verbe HTTP
app.use(methodOverride('_method', { methods: [ 'POST', 'GET' ] }))

// Middleware pour parser le body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//Middleware pour parser les cookies
app.use(cookieParser());

//Middleware pour utiliser les sessions
app.use(session({
    secret:"secretStringForTodolistProjet",
    resave: false,
    saveUninitialized: true
}));

// Préprocesseur sur les fichiers scss -> css
app.use(sass({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'assets', 'css'),
  prefix: '/css',
  outputStyle: 'expanded'
}))

// On sert les fichiers statiques
app.use(express.static(path.join(__dirname, 'assets')))

// Middleware d'authentification
// app.use((req, res, next) => {
//   if(req.url == '/session')
//     next()
//   else
//     // Vérifier l'authentification
// })

// La liste des différents routeurs (dans l'ordre)
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.use('/todos', require('./routes/todos'))
app.use('/teams', require('./routes/teams'))

// Erreur 404
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Gestion des erreurs
// Notez les 4 arguments !!
app.use(function(err, req, res, next) {
  // Les données de l'erreur
  let data = {
    message: err.message,
    status: err.status || 500
  }

  // En mode développement, on peut afficher les détails de l'erreur
  if (app.get('env') === 'development') {
    data.error = err.stack
  }

  // On set le status de la réponse
  res.status(data.status)

  res.format({
    html: () => {
      res.render('error', {
      message: data.message,
      error: data.error,
      status: data.status,
      data : JSON.stringify(data)
      }
    )},
    json: () => { res.send(data) }
  })
})

db.open('bdd.db').then(() => {
  console.log('> BDD ouverte')
  return db.run('CREATE TABLE IF NOT EXISTS users (pseudo, firstname, lastname, email, password)')
}).then(() => {
  console.log('> Table persistée')
  app.listen(PORT, () => {
    console.log('> Serveur démarré sur le port : ', PORT)
  })
}).catch((err) => {
  console.error('ERR > ', err)
})
