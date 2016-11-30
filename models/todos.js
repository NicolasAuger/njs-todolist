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

    get: (id, callback) => {
        todoModel.find({"_id": id}, function(err, todo) {
            if(!err){
                callback(todo[0])
            }else{
                throw err
            }
        })
    },

    getAll: (callback) => {
        todoModel.find({}, function(err, todos) {
            if(!err){
                callback(todos)
            }else{
                throw err
            }
        }).sort({is_completed: 1, createdAt: -1})
    },


    insert: (body, callback) => {
        var newTodo = new todoModel()

        newTodo.author = body.author
		newTodo.task = body.task
        newTodo.recipient = body.recipient
        //newTodo.team = body.team
        newTodo.save(function(err, data) {
            if (err){console.log('Error : ', err)}
            else{callback(data)}
        })
    },


    update: (id, body, callback) => {
  		todoModel.findById(id, function (err, todo) {
  			if (err) throw(err)
            todo.author = body.author
    		todo.task = body.task
            todo.recipient = body.recipient
            // todo.team = body.team
            todo.modifiedAt = Date.now()

  			todo.save(function (err) {
  				if (err) throw(err)
  				callback()
  			})

  		})
  	},


    remove: (id ,callback) => {
		todoModel.remove({ "_id": id }, function(err) {
			if (!err) {callback('success')}
			else {message.type = 'error'}
		});
	},


    complete: (id, callback) => {
        todoModel.findOne({"_id": id}, function(err, todo) { // Faire findOne plutôt que Find et return todo[0].
            todo.is_completed = true
            todo.completedAt = Date.now()
            todo.save(function (err) {
  				if (err) throw(err)
  				callback(todo)
  			})
        })
    },


}
