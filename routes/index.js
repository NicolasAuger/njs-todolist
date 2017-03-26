const router = require('express').Router()


const User = require('../models/users.js')
const Todo = require('../models/todos.js')
const Team = require('../models/teams.js')
var session = require('express-session')
var bcrypt = require('bcrypt')

// Route GET Redirige vers la page d'accueil
router.get('/',function(req, res, next){
    res.redirect('/index')
})

// Route GET Page d'accueil , Affiche form de login
router.get('/index', function(req, res, next) {
  res.render('login', {
      title: 'TP Njs-TodoList - NodeJs / NoSQL' })
})

// Route POST Connexion avec form
router.post('/index', function(req, res) {
    var pseudo = req.body.pseudo
    User.getOne(pseudo, function(user){
        if (!user){
            console.log("Oups, cet utilisateur n'existe pas");
            res.render('login',{
                title: 'TP Njs-TodoList - NodeJs / NoSQL', error: "Oups, cet utilisateur n'exsite pas, vérifie les identifiants que tu as rentré !"})
        }
        req.session.user = user
        if(bcrypt.compareSync(req.body.password1, user.password) == true){
            console.log("Les mots de passe correspondent ! Vous etes authentifiés avec succès");
            res.redirect('/'+user._id+'/dashboard')
        }else{
            console.log("Mauvais mot de passe, connexion échouée");
            res.redirect('/index')
        }
    })
})

// Route GET pour créer un compte
router.get('/signup', function(req, res, next){
    Team.getAll(function(teams){
        res.format({
            html: () => {
                res.render('users/add', {
                    teams: teams,
                    action: '/signup',
      		        title: "TP Njs-TodoList - NodeJs / NoSQL",
                  })
                },
            json: () => {
                let error = new Error('Bad Request')
                error.status = 400
                next(error)
            }
        })
	})
})

// Route POST pour créer un compte
router.post('/signup', function(req, res){
    var body = req.body
    if (!body.pseudo || !body.firstname || !body.lastname || !body.email || !body.password1 || !body.password2){
        console.log("Error: One or more fields are empty");
        res.redirect('/signup')
    }else{
        User.insert(body, function(users){
            res.redirect('/index')
        })
    }
})

//Route GET Affiche Dashboard personnel de l'utilisateur connecté
router.get("/:id/dashboard", function(req, res){
    User.getAllForOne(req.session.user._id, function(user){
        if(!req.session.user){
            console.log("Session d'user non créée");
            res.render('login', {
                title: 'TP Njs-TodoList - NodeJs / NoSQL'})
            return res.status(401).send()
        }else{
            res.render('index', {
                title: 'TP Njs-TodoList - NodeJs / NoSQL', userId: user._id, userPseudo: user.pseudo , userTeam: user.team })
        }
    })

})

// #######################################  Les routes suivantes sont accessible depuis une session d'user connecté ##############################################

// Route GET Afficher les tâches de l'utilisateur (vue User)
router.get('/:id/todos', function(req, res, next){
    var pseudo = req.session.user.pseudo
    Todo.getAll(function(todos){
		var data = {todos: todos, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userPseudo: req.session.user.pseudo, userId: req.session.user._id}
		res.format({
	      html: () => { res.render('todos/index_user', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

// Route GET Affiche toutes les teams (vue User : ne peut ni éditer ni supprimer les teams)
router.get('/:id/teams', function(req, res, next){
    var pseudo = req.session.user.pseudo
    Team.getAll(function(teams){
		var data = {teams: teams, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userPseudo: req.session.user.pseudo, userId: req.session.user._id}
		res.format({
	      html: () => { res.render('teams/index_user', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

// Route GET l'Utilisateur quitte sa team
router.get('/:id/leave_team', function(req, res, next){
    var data = {title :"TP Njs-TodoList - NodeJs / NoSQL", userId: req.session.user._id }
    res.format({
      html: () => { res.render('teams/leave', data) },
      json: () => { res.status(201).send({data: data}) }
    })
})

// Route POST l'utilisateur quitte sa team
router.post('/:id/leave_team', function(req, res, next){
    var id = req.session.user._id
    User.leaveTeam(id, function(user){
        console.log(user);
        res.redirect('/'+id+'/dashboard')
    })
})

// Route GET Affiche tous les users (vue User : ne peut ni éditer ni supprimer les autres users)
router.get('/:id/users', function(req, res, next){
    var pseudo = req.session.user.pseudo
    User.getAll(function(users){
		var data = {users: users, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userPseudo: req.session.user.pseudo, userId: req.session.user._id}
		res.format({
	      html: () => { res.render('users/index_user', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

// Route GET Modification des infos de son compte (permet également de rejoindre une team)
router.get('/:id/edit', function(req, res, next){
    User.get(req.session.user._id, function(user) {
        Team.getAll(function(teams){
            res.format({
                html: () => {
                    res.render('users/edit', {
                        title: "TP Njs-TodoList - NodeJs / NoSQL",
                        user: user,
                        teams: teams
                    })
                },
                json: () => {
                    let error = new Error('Bad Request')
                    error.status = 400
                    next(error)
                }
            })
        })
    })
})

// Route POST Modification des infos de son compte (permet également de rejoindre une team)
router.post('/:id/edit', (req, res) => {
    var id = req.params.id
    var body = req.body
    User.update(id,body, () => {
        res.redirect('/'+id+'/dashboard')
    })
})

// Route GET Affiche les infos du compte
router.get('/:id/infos', (req, res, next) => {
	var id = req.params.id
    console.log(req);
	User.getAllForOne(id, function(user){
	  	var data = {user: user, title:"TP Njs-TodoList - NodeJs / NoSQL"}
	  	res.format({
	  	  html: () => { res.render('users/show', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

// Route GET Créer une nouvelle tâche
router.get('/:id/todos/add', function(req, res, next) {
    User.getAll(function(users){
		res.format({
	      html: () => {
	        res.render('todos/add_user', {
              title: "TP Njs-TodoList - NodeJs / NoSQL",
	          todo: {},
	          action: '/todos',
              users: users,
              userId: req.session.user._id,
              userPseudo: req.session.user.pseudo
	        })
	      },
	      json: () => {
	        let error = new Error('Bad Request')
	        error.status = 400
	        next(error)
	      }
	    })
	})
})

// Route POST Ajouter une nouvelle tâche
router.post('/:id/todos/add', function(req, res){
    var id = req.session.user._id
    Todo.insert(req.body, function(todos){
        res.redirect('/'+id+'/todos')
    })
})

// Route GET pour voir les infos d'une tâche du compte connecté
router.get('/:id/todos/:id', (req, res, next) => {
	var id = req.params.id
	Todo.get(id, function(todo){
	  	var data = {todo: todo, title:"TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userId: req.session.user._id, userPseudo: req.session.user.pseudo}
	  	res.format({
	  	  html: () => { res.render('todos/show', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

// Router DELETE Supprime la tâche selectionné du compte connecté
router.delete('/:id/todos/:id', (req, res, next) => {
	var id = req.params.id
    Todo.remove(id, function(){
  	  res.redirect('/:id/todos')
    })
})

// Route GET Complète la tâche selectionnée (compte user)
router.get('/:id/todos/:id/complete', (req, res, next) => {
	var id = req.params.id
	Todo.get(id, function(todo){
	  	var data = {todo: todo, title:"TP Njs-TodoList - NodeJs / NoSQL", moment : require('moment'), userId: req.session.user._id}
	  	res.format({
	  	  html: () => { res.render('todos/delete_user', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

// Route POST pour compléter une tâche du compte connecté
router.post('/:id/todos/:id/complete', (req, res, next) => {
	verif = req.body.complete
	switch (verif) {
		case "Oui":
			Todo.complete(req.params.id, function(todo){
				res.redirect("/:id/todos")
			})
			break;
		default:
			res.redirect('/:id/todos')
			break;
	}
})

module.exports = router
