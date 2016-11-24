const mongoose = require('mongoose')
const moment = require('moment')
var bcrypt = require('bcrypt');
const saltRounds = 10;

moment.locale('fr')

var userSchema = mongoose.Schema({
    pseudo : {type: String, required: true, unique: true},
    firstname : {type: String, required: true, unique: false},
    lastname : {type: String, required: true, unique: false},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: null}
})

var userModel = mongoose.model('users', userSchema)

module.exports = {

  get: (id, callback) => {
      //console.log('id :',id);
    userModel.find({"_id": id}, function(err, user) {
        //console.log(user);
        if(!err){
            callback(user[0])
        }else{
            throw err
        }
    })
  },


  getAll: (callback) => {
    userModel.find({}, function(err, users) {
        if(!err){
            callback(users)
        }else{
            throw err
        }
    })
  },


  insert: (body, callback) => {
        var newUser = new userModel()

        newUser.pseudo = body.pseudo
		newUser.firstname = body.firstname
        newUser.lastname = body.lastname
        newUser.email = body.email
        //newUser.createdAt = moment().calendar()

		if (body.password1 == body.password2){
			newUser.password = body.password1
            var salt = bcrypt.genSaltSync(saltRounds);
            var pass_hash = bcrypt.hashSync(newUser.password, salt);
            newUser.password = pass_hash

            newUser.save(function(err, data) {
                if(bcrypt.compareSync(body.password1, pass_hash)){console.log("Password hashé et crypté avec succes ! ")}else{console.log("Erreur : Le hash du password n'a pas fonctionné !")}
				if (err){console.log('Error : ', err)}
				else{callback(data)}
			});
		}else{
            console.log('Error : Passwords are not the same, try again !')
			callback(null);
		}
    },


    update: (id, body, callback) => {

  		userModel.findById(id, function (err, user) {
  			if (err) throw(err)
            //console.log(body)
            user.pseudo = body.pseudo
    		user.firstname = body.firstname
            user.lastname = body.lastname
            user.email = body.email
            user.modifiedAt = Date.now()

            //if (body.password1 == user.password && body.password2 == user.password && body.password1 == body.password2){
  			user.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})
            //}
  		})
  	},

  remove: (id ,callback) => {
		userModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},


}
