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

  get: (id, callback) => {
    userModel.find({"_id": id}, function(err, user) {
        if(!err){callback(user[0])}
        else{throw err}
    })
  },

  getOne: (pseudo, callback) => {
    userModel.find({"pseudo": pseudo}, function(err, user) {
        if(!err){callback(user[0])}
        else{throw err}
    })
  },

  getInTeam: (team, callback) => {
    userModel.find({"team": team}, function(err, users){
        if(!err){callback(users)}
        else{throw err}
    })
  },


  getAll: (callback) => {
    userModel.find({}).populate("team", "name").exec(function(err, users) {
        if(!err){callback(users)}
        else{throw err}
    })
  },


  insert: (body, callback) => {
        var newUser = new userModel()

        newUser.pseudo = body.pseudo
		newUser.firstname = body.firstname
        newUser.lastname = body.lastname
        newUser.email = body.email
        newUser.team = body.team

		if (body.password1 == body.password2){
			newUser.password = body.password1
            var salt = bcrypt.genSaltSync(saltRounds);
            var pass_hash = bcrypt.hashSync(newUser.password, salt);
            newUser.password = pass_hash
            if(bcrypt.compareSync(body.password1, pass_hash)){
                console.log("Password hashé et crypté avec succes ! ")
            }else{
                console.log("Erreur : Le hash du password n'a pas fonctionné !")
            }
            newUser.save(function(err) {
                if (err){console.log(err)}
                else{callback()}
			})
		}else{
            console.log('Error : Passwords are not the same, try again !')
            callback(null)
        }
    },


    update: (id, body, callback) => {

  		userModel.findById(id, function (err, user) {
  			if (err) throw(err)
            user.pseudo = body.pseudo
    		user.firstname = body.firstname
            user.lastname = body.lastname
            user.email = body.email
            user.team = body.team
            user.modifiedAt = Date.now()

  			user.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})

  		})
  	},

  remove: (id ,callback) => {
		userModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},


}
