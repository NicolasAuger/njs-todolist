const mongoose = require('mongoose')
const moment = require('moment')
var bcrypt = require('bcrypt');
const Team = require('../models/teams.js')
const saltRounds = 10;

moment.locale('fr')

var userSchema = mongoose.Schema({
    pseudo : {type: String, unique: true},
    firstname : {type: String, unique: false},
    lastname : {type: String, unique: false},
    email : {type: String, unique: true},
    team : {type: mongoose.Schema.Types.ObjectId, ref: "teams"},
    password: {type: String, unique: false},
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: null}
})

var userModel = mongoose.model('users', userSchema)

module.exports = {

// Methode pour récupérer un user par son ID
  get: (id, callback) => {
    userModel.find({"_id": id}, function(err, user) {
        if(!err){callback(user[0])}
        else{throw err}
    })
  },

// Methode pour récupérer la team d'un user
  getAllForOne: (id, callback) => {
    userModel.find({"_id": id}).populate("team", "name").exec(function(err, user) {
        if(!err){callback(user[0])}
        else{throw err}
    })
  },

// Methode pour récupérer tous les users d'une même team
  getUsersInTeam: (teamId, callback) => {
    userModel.find({"team": teamId}, function(err, users) {
        if(!err){callback(users)}
        else{throw err}
    }).count()
  },

// Méthode pour récupéerer un user par son pseudo
  getOne: (pseudo, callback) => {
    userModel.find({"pseudo": pseudo}, function(err, user) {
        if(!err){callback(user[0])}
        else{throw err}
    })
  },

// Récuperer tous les users et leur team
  getAll: (callback) => {
    userModel.find({}).populate("team", "name").exec(function(err, users) {
        if(!err){callback(users)}
        else{throw err}
    })
  },


// Methode pour créer un utilisateur et l'insérer dans la base MongoDB
  insert: (body, callback) => {
        var newUser = new userModel()

        newUser.pseudo = body.pseudo
		newUser.firstname = body.firstname
        newUser.lastname = body.lastname
        newUser.email = body.email
        newUser.team = body.team != "none" ? body.team : null

		if (body.password1 == body.password2){ // Vérification si les deux mdp correspondent
			newUser.password = body.password1
            var salt = bcrypt.genSaltSync(saltRounds);
            var pass_hash = bcrypt.hashSync(newUser.password, salt); // On hash le password
            newUser.password = pass_hash
            if(bcrypt.compareSync(body.password1, pass_hash)){ // Si les deux correspondent bien on log que c'est un succès
                console.log("Password hashé et crypté avec succes ! ")
            }else{
                console.log("Erreur : Le hash du password n'a pas fonctionné !")
            }
            newUser.save(function(err) { // On enregistre l'user dans la base MongoDB
                if (err){console.log(err)}
                else{callback()}
			})
		}else{
            console.log('Error : Passwords are not the same, try again !')
            callback(null)
        }
    },

// methode pour modifier l'utilisateur et insérer les modifications dans la base MongoDB
    update: (id, body, callback) => {

  		userModel.findById(id, function (err, user) {
  			if (err) throw(err)
            user.pseudo = body.pseudo
    		user.firstname = body.firstname
            user.lastname = body.lastname
            user.email = body.email
            user.team = body.team != "none" ? body.team : null
            user.modifiedAt = Date.now()

  			user.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})

  		})
  	},

// methode pour supprimer un utilisateur
  remove: (id ,callback) => {
		userModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},

// methode pour que l'utilisateur quitte sa team
    leaveTeam: (id, callback) => {
        userModel.findById(id, function(err, user){
            user.team = null
            user.save(function(err) {
                if (err) throw(err)
                callback()
            })
        })
    },
}
