const router = require('express').Router()
const User = require('../models/users.js')
const Todo = require('../models/todos.js')
const Team = require('../models/teams.js')
var session = require('express-session')
var bcrypt = require('bcrypt')
/* Page d'accueil */

router.get('/',function(req, res, next){
    res.redirect('/index')
})

router.get('/index', function(req, res, next) { //Affiche le formulaire de logIn
  res.render('login', {
      title: 'TP Njs-TodoList - NodeJs / NoSQL' })
})

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

router.get("/:id/dashboard", function(req, res){
    User.getAllForOne(req.params.id, function(user){
        if(!req.session.user){
            console.log("Session d'user non créée");
            res.render('login', {
                title: 'TP Njs-TodoList - NodeJs / NoSQL'})
            return res.status(401).send()
        }else{
            res.render('index', {
                title: 'TP Njs-TodoList - NodeJs / NoSQL', userId: user._id, userPseudo: user.pseudo , userTeam: user.team.name })
            // return res.status(200).send("Bienvenue sur ton dashboard privé")
        }
    })

})

// #######################################   Gérer les todos depuis l'interface d'un user connecté
router.get('/:id/todos', function(req, res, next){
    var pseudo = req.session.user.pseudo
    Todo.getAll(function(todos){
        console.log(pseudo);
		var data = {todos: todos, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userPseudo: req.session.user.pseudo, userId: req.session.user._id}
		res.format({
	      html: () => { res.render('todos/index_user', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})


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


router.get('/:id/todos/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('todos/add_user', {
        todo: {},
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

router.delete('/:id/todos/:id', (req, res, next) => {
	var id = req.params.id
    Todo.remove(id, function(){
  	  res.redirect('/:id/todos')
    })
})


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
