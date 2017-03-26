const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('fr')

var todoSchema = mongoose.Schema({
    author : {type: String, required: true},
    task : {type: String, required: true},
    recipient : {type: String, required: true},
    is_completed: {type: Boolean, default: false},
    //team : {type: String},
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: null},
    completedAt: {type: Date, default: null}
})

var todoModel = mongoose.model('todos', todoSchema)

module.exports = {

// Méthode pour recuperer une tâche par son ID
    get: (id, callback) => {
        todoModel.find({"_id": id}, function(err, todo) {
            if(!err){
                callback(todo[0])
            }else{
                throw err
            }
        })
    },

// Methode pour récuperer toutes les tâches (triées par date de création (avec les complétées en bas et les "en cours" au dessus))
    getAll: (callback) => {
        todoModel.find({}, function(err, todos) {
            if(!err){
                callback(todos)
            }else{
                throw err
            }
        }).sort({is_completed: 1, createdAt: -1})
    },

// Methode pour créer une nouvelle tâche
    insert: (body, callback) => {
        var newTodo = new todoModel()

        newTodo.author = body.author
		newTodo.task = body.task
        newTodo.recipient = body.recipient
        newTodo.save(function(err, data) {
            if (err){console.log('Error : ', err)}
            else{callback(data)}
        })
    },

// Methode pour modifier une tâche
    update: (id, body, callback) => {
  		todoModel.findById(id, function (err, todo) {
  			if (err) throw(err)
            todo.author = body.author
    		todo.task = body.task
            todo.recipient = body.recipient
            todo.modifiedAt = Date.now()

  			todo.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})

  		})
  	},

// methode pour supprimer une tâche
    remove: (id ,callback) => {
		todoModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},

// Methode pour compléter une tâche
    complete: (id, callback) => {
        todoModel.findOne({"_id": id}, function(err, todo) {
            todo.is_completed = true
            todo.completedAt = Date.now()
            todo.save(function (err) {
  				if (err) throw(err)
  				callback(todo)
  			})
        })
    },
}
