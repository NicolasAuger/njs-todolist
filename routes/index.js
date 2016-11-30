const router = require('express').Router()
const User = require('../models/users.js')
const Todo = require('../models/todos.js')
var session = require('express-session')
var bcrypt = require('bcrypt')
/* Page d'accueil */
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
            console.log("Les deux mdp ne sont pas identifiques");
            res.redirect('/index')
        }
    })

})

router.get('/signup', function(req, res, next){
    res.render('users/add',{
        title: 'TP Njs-TodoList - NodeJs / NoSQL'
    })
})

router.post('/signup', function(req, res){
    User.insert(req.body, function(users){
		res.redirect('/index')
	})
})

router.get("/:id/dashboard", function(req, res){
    if(!req.session.user){
        console.log("Session d'user non créée");
        res.render('login', {
            title: 'TP Njs-TodoList - NodeJs / NoSQL'})
        return res.status(401).send()
    }else{
        res.render('index', {
            title: 'TP Njs-TodoList - NodeJs / NoSQL', userId: req.session.user._id  })
        // return res.status(200).send("Bienvenue sur ton dashboard privé")
    }
})


router.get('/:id/todos', function(req, res, next){
	console.log(req);
    var pseudo = req.session.user.pseudo
    Todo.getAll(function(todos){
		var data = {todos: todos, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), userPseudo: req.session.user.pseudo}
		res.format({
	      html: () => { res.render('todos/index_user', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})


module.exports = router
