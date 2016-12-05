const router = require('express').Router()
const Todo = require('../models/todos.js')
const User = require('../models/users.js')

// Route GET pour voir la liste des tâches de tout le monde (vue Admin)
router.get('/', function(req, res, next) {
	Todo.getAll(function(todos){
		var data = {todos: todos, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment')}
		res.format({
	      html: () => { res.render('todos/index', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

// Route POST pour insérer une nouvelle tâche (vue Admin)
router.post('/', function(req, res, next){
	Todo.insert(req.body, function(todos){
		res.redirect('/todos')
	})
})


router.post('/add', function(req, res){
	res.render('todos/add', {
		title: "TP Njs-TodoList - NodeJs / NoSQL"
	})
})

// Route GET pour ajouter une nouvelle tâche (vue Admin)
router.get('/add', function(req, res, next) {
	User.getAll(function(users){
		res.format({
	      html: () => {
	        res.render('todos/add', {
	          todo: {},
			  title: "TP Njs-TodoList - NodeJs / NoSQL",
	          action: '/todos',
			  users: users
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

// Route GET modification de tâche (vue Admin)
router.get('/:id/edit', function(req, res, next) {
  Todo.get(req.params.id, function(todo) {

    res.format({
      html: () => {
        res.render('todos/edit', {
          todo: todo,
		  title: "TP Njs-TodoList - NodeJs / NoSQL"
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

// Route GET Show tâche (vue Admin)
router.get('/:id', (req, res, next) => {
	var id = req.params.id
	Todo.get(id, function(todo){
	  	var data = {todo: todo, title:"TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment')}
	  	res.format({
	  	  html: () => { res.render('todos/show', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

//Route POST modification de tâche (vue Admin)
router.post('/:id/edit', (req, res) => {
	var id = req.params.id
	var body = req.body
	Todo.update(id,body, () => {
		res.redirect('/todos')
	})
})

// ROute DELETE supprimier une tâche (vue Admin)
router.delete('/:id', (req, res, next) => {
	var id = req.params.id
    Todo.remove(id, function(){
  	  res.redirect('/todos')
    })
})

// Route GET COmpleter une tâche (vue Admin)
router.get('/:id/complete', (req, res, next) => {
	var id = req.params.id
	Todo.get(id, function(todo){
	  	var data = {todo: todo, title:"TP Njs-TodoList - NodeJs / NoSQL", moment : require('moment')}
	  	res.format({
	  	  html: () => { res.render('todos/delete', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

//Routz POST pour completer une tâche (vue Admin)
router.post('/:id/complete', (req, res, next) => {
	verif = req.body.complete
	switch (verif) {
		case "Oui":
			Todo.complete(req.params.id, function(todo){
				res.redirect("/todos")
			})
			break;
		default:
			res.redirect('/todos')
			break;
	}
})
module.exports = router
