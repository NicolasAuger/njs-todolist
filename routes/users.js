const router = require('express').Router()
const User = require('../models/users.js')
const moment = require('moment')
const Todo = require('../models/todos.js')
const Team = require('../models/teams.js')
moment.locale('fr')

/* Users : liste */
router.get('/', function(req, res, next) {
	User.getAll(function(users){
		var data = {users: users, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment')}
		res.format({
	      html: () => { res.render('users/index', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

router.post('/', function(req, res, next){
	User.insert(req.body, function(users){
		res.redirect('/users')
	})
})

router.post('/add', function(req, res){
	Team.getAll(function(teams){
		res.render('users/add', {
			title: "TP Njs-TodoList - NodeJs / NoSQL",
			user: {},
	        action: '/users',
			teams: teams
		})
	})
})

router.get('/add', function(req, res, next) {
  Team.getAll(function(teams){
	  res.format({
		html: () => {
		  res.render('users/add', {
			user: {},
			action: '/users',
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


router.get('/:id/edit', function(req, res, next) {
  User.get(req.params.id, function(user) {
	Team.getAll(function(teams){
	    res.format({
	      html: () => {
	        res.render('users/edit', {
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

router.get('/:id', (req, res, next) => {
	var id = req.params.id
	User.getAllForOne(id, function(user){
	  	var data = {user: user, title:"TP Njs-TodoList - NodeJs / NoSQL",  welcome: "Bienvenue "+ user.pseudo}
	  	res.format({
	  	  html: () => { res.render('users/show', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

router.post('/:id/edit', (req, res) => {
	var id = req.params.id
	var body = req.body
	User.update(id,body, () => {
		res.redirect('/users')
	})
})

router.delete('/:id', (req, res, next) => {
	var id = req.params.id
    User.remove(id, function(){
  	  res.redirect('/users')
    })
})

module.exports = router
