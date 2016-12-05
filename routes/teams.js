const router = require('express').Router()
const User = require('../models/users.js')
const moment = require('moment')
const Team = require('../models/teams.js')
moment.locale('fr')

// Route GET pour afficher toutes les teams
router.get('/', function(req, res, next) {
	Team.getAll(function(teams){
		var data = {teams: teams, title: "TP Njs-TodoList - NodeJs / NoSQL", moment: require('moment'), error:"One or more fields are empty"}
		res.format({
	      html: () => { res.render('teams/index', data) },
	      json: () => { res.status(201).send({data: data}) }
	    })
	})
})

// Route POST pour ajouter une nouvelle team (vue Admin)
router.post('/', function(req, res, next){
    Team.insert(req.body, function(teams){
		res.redirect('/teams')
	})
})


router.post('/add', function(req, res){
	res.render('teams/add', {
		title: "TP Njs-TodoList - NodeJs / NoSQL"
	})
})

//Route GET pour ajouter une team (vue Admin)
router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('teams/add', {
        team: {},
        action: '/teams',
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

//Route GET Modification de team (vue Admin)
router.get('/:id/edit', function(req, res, next) {
  Team.get(req.params.id, function(team) {
    res.format({
      html: () => {
        res.render('teams/edit', {
			title:"TP Njs-TodoList - NodeJs / NoSQL",
            team: team,
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

//Route GET Voir les infos d'une team (vue Admin)
router.get('/:id', (req, res, next) => {
	var id = req.params.id
    var body = req.body
	Team.get(id, function(team){
		User.getUsersInTeam(team._id, function(users){
			var data = {team: team, title:"TP Njs-TodoList - NodeJs / NoSQL", nbr: users.length, members: users}
		  	res.format({
		  	  html: () => { res.render('teams/show', data) },
		  	  json: () => { res.status(201).send({data: data}) }
		  	})
		})
	})
})

// Route POST Modifcation d'une team (vue Admin)
router.post('/:id/edit', (req, res) => {
	var id = req.params.id
	var body = req.body
	Team.update(id,body, () => {
		res.redirect('/teams')
	})
})

//Route DELETE Supprimer une team (vue Admin)
router.delete('/:id', (req, res, next) => {
	var id = req.params.id
    Team.remove(id, function(){
  	  res.redirect('/teams')
    })
})

module.exports = router
