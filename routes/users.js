const router = require('express').Router()
const User = require('../models/users.js')

/* Users : liste */
router.get('/', function(req, res, next) {
	User.getAll(function(users){
		var data = {users: users, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment')}
		//console.log(data);
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
	//console.log("Ajout d'un utilisateur");
	res.render('users/add', {
		title: "TP Njs-TodoList - NodeJs / NoSQL"
	})
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('users/add', {
        user: {},
        action: '/users'
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
  User.get(req.params.id, function(user) {

    res.format({
      html: () => {
        res.render('users/edit', {
          user: user,
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
	User.get(id, function(user){
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
		//console.log(body.pseudo);
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

























///
