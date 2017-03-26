const mongoose = require('mongoose')
const moment = require('moment')
const User = require('../models/users.js')
moment.locale('fr')

var teamSchema = mongoose.Schema({
	name:String,
    slogan: String,
	createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: null}
})
var teamModel = mongoose.model('teams', teamSchema)

module.exports = {

    // La liste des membres ne sera pas stockée dans la table "teams" dans MongoDB.
    // C'est à partir de la table "users" que nous allons les récupérer.

    //Method GET pour récupérer les infos d'une team par son ID
    get: (id, callback) => {
        teamModel.find({"_id": id}, function(err, team) {
            if(!err){callback(team[0])}
            else{throw err}
        })
      },

// Méthode pour récuperer toutes les teams
    getAll: (callback) => {
      teamModel.aggregate({
		  $lookup: {
			  from: "users",
			  localField: "_id",
			  foreignField: "team",
			  as: "users"
		  }
	  }, function(err, teams) {
          if(!err){callback(teams)}
          else{throw err}
      })
    },

// Methode pour compter le nombre d'utilisateur dans chaque team
    count: (body, callback) =>{
        teamModel.find({}, function(err, teams){
            if(!err){callback(teams)}
            else{throw err}
        }).count()
    },

    //Créer une nouvelle équipe et l'insert dans la base MongoDB
    insert: (body, callback) => {
        var newTeam = new teamModel()
        newTeam.name = body.name
        newTeam.slogan = body.slogan
        newTeam.save(function(err, data) {
            if (err){console.log('Error !')}
            else{callback(data)}
        });
    },

    // Méthode pour modifier une team
    update: (id, body, callback) => {
  		teamModel.findById(id, function (err, team) {
  			if (err) throw(err)
            team.name = body.name
    		team.slogan = body.slogan
            team.modifiedAt = Date.now()
  			team.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})
  		})
  	},

  // Méthode pour Supprimer l'équipe selectionnée
  remove: (id ,callback) => {
		teamModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},
}
