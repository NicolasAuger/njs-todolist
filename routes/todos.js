const router = require('express').Router()
const Todo = require('../models/todos.js')

/* Todos : liste */
router.get('/', function(req, res, next) {
	Todo.getAll(function(todos){
		var data = {todos: todos, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment')}
		res.format({
	      html: () => { res.render('todos/index', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

router.post('/', function(req, res, next){
	Todo.insert(req.body, function(todos){
		res.redirect('/todos')
	})
})

router.post('/add', function(req, res){ // Route post pour ajout d'une todo
	res.render('todos/add', {
		title: "TP Njs-TodoList - NodeJs / NoSQL"
	})
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('todos/add', {
        todo: {},
        action: '/todos'
      })
    },
    json: () => {
      let error = new Error('Bad Request')
      error.status = 400
      next(error)
    }
  })
})

router.get('/:id/edit', function(req, res, next) {
  Todo.get(req.params.id, function(todo) {

    res.format({
      html: () => {
        res.render('todos/edit', {
          todo: todo,
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

router.post('/:id/edit', (req, res) => {
	var id = req.params.id
	var body = req.body
	Todo.update(id,body, () => {
		//console.log(body.pseudo);
		res.redirect('/todos')
	})
})

router.delete('/:id', (req, res, next) => {
	var id = req.params.id
    Todo.remove(id, function(){
  	  res.redirect('/todos')
    })
})


router.get('/:id/complete', (req, res, next) => {
	var id = req.params.id
	Todo.complete(id, function(todo){
	  	var data = {todo: todo, title:"TP Njs-TodoList - NodeJs / NoSQL", moment : require('moment')}
	  	res.format({
	  	  html: () => { res.render('todos/delete', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

router.post('/:id/complete', (req, res, next) => {
	verif = req.body.complete
	//console.log(verif);
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
