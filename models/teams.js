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

    //Method GET pour récupérer les infos d'une team, en fonction de son ID
    get: (id, callback) => {
        teamModel.find({"_id": id}, function(err, team) {
            if(!err){callback(team[0])}
            else{throw err}
        })
      },

    //Method GET pour récupérer la liste des utilisateurs dans une certaine team
    getTeamMembers: (name, callback) => {
      User.getInTeam(name, function(users){
          callback(users)
      })
    },

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

    count: (body, callback) =>{
        teamModel.find({}, function(err, teams){
            if(!err){callback(teams)}
            else{throw err}
        }).count()
    },

    //Ajoute un membre à cette équipe
    // addMember: (pseudo, name) => {
	// 	User.getOne(pseudo, function(user){
	// 		user.team = body.team
	// 		nb_of_members += 1
    //         user.save(function (err) {
    //             if (err) throw(err)
    //             callback()
    // 		})
	// 	})
	// },

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

    //Fait quitter l'utilisateur de son équipe
    quit: (pseudo) => {
        User.getOne(pseudo, function (err, user) {
            var text = "N'a pas de rejoint de team"
            if (err) throw(err)
            user.team = text
            user.save(function (err) {
                if (err) throw(err)
                callback()
            })
        })
    },

    //Update l'équipe
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

  //Supprime l'équipe selectionnée
  remove: (id ,callback) => {
		teamModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},
}
