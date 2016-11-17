const router = require('express').Router()
const User = require('../models/users.js')

/* Users : liste */
router.get('/', function(req, res, next) {
	User.getAll(function(users){
		var data = {users: users, title: "Bienvenue"}
		console.log(data);
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
	console.log("Ajout d'un utilisateur");
	res.render('users/edit', {
		title: "Ajout d'un utilisateur"
	})
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('users/edit', {
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

router.get('/:userId/edit', function(req, res, next) {
  User.get(req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => {
        res.render('users/edit', {
          user: user,
          action: `/users/${user.rowid}?_method=put`
        })
      },
      json: () => {
        let error = new Error('Bad Request')
        error.status = 400
        next(error)
      }
    })
  }).catch(next)
})

router.get('/:id', (req, res, next) => {
	var id = req.params.id
	User.get(id, function(user){
	  	var data = {user: user, title: "Bienvenue "+ user.pseudo}
	  	console.log(data);
	  	res.format({
	  	  html: () => { res.render('users/show', data) },
	  	  json: () => { res.status(201).send({data: data}) }
	  	})
	})
})

router.put('/:userId', (req, res, next) => {
  User.update(req.params.userId, req.body).then(() => {
    res.format({
      html: () => { res.redirect(`/users/${req.params.userId}`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

router.delete('/:id', (req, res, next) => {
	var id = req.params.id
    User.remove(id, function(){
  	  res.redirect('/users')
    })
})

module.exports = router

























///
