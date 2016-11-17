const mongoose = require('mongoose')
const time = require('moment')
time.locale('fr')

var userSchema = mongoose.Schema({
    pseudo : {type: String, required: true, unique: true},
    firstname : {type: String, required: true, unique: false},
    lastname : {type: String, required: true, unique: false},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    createdAt: {type: String},
    modifiedAt: {type: String, default: "Not Updated Yet !"}
})

var userModel = mongoose.model('users', userSchema)
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/users', function(err) {
    if (err) { throw err}
})

module.exports = {

  get: (id, callback) => {
      //console.log('id :',id);
    userModel.find({"_id": id}, function(err, user) {
        console.log(user);
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
        var accepted_attributes = ['pseudo', 'firstname', 'lastname', 'email', 'password']
        var not_yet = "Not updated yet !"
        newUser.pseudo = body.pseudo
		newUser.firstname = body.firstname
        newUser.lastname = body.lastname
        newUser.email = body.email
        newUser.password = body.password
        newUser.createdAt = time().calendar()

		if (body.password1 == body.password2){
			newUser.password = body.password1
            newUser.save(function(err, data) {
				if (err){console.log('Error : ', err)}
				else{callback(data)}
			});
		}else{
			callback(null);
		}
    },


  update: (userId, params) => {
    const possibleKeys = ['firstname', 'lastname', 'email', 'pseudo', 'password']

    let dbArgs = []
    let queryArgs = []
    for (key in params) {
      if (-1 !== possibleKeys.indexOf(key)) {
        queryArgs.push(`${key} = ?`)
        dbArgs.push(params[key])
      }
    }

    if (!queryArgs.length) {
      let err = new Error('Bad Request')
      err.status = 400
      return Promise.reject(err)
    }

    dbArgs.push(userId)
    dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')

    return db.run.apply(db, dbArgs).then((stmt) => {
      if (stmt.changes === 0){
        let err = new Error('Not found')
        err.status = 404
        return Promise.reject(err)
      }

      return stmt
    })
  },

  remove: (id ,callback) => {
		userModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},


}
