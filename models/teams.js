const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('fr')

var teamSchema = mongoose.Schema({
	members: [],
	name:String,
	createdAt: {type: String, default: Date.now},
    modifiedAt: {type: Date, default: null}
})
var teamModel = mongoose.model('teams', teamSchema)

module.exports = {

}
