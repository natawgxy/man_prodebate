const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const TeamSchema = new Schema({
    name: {type: String, require: true},
    members: [String]
})
const Future_tournament_Schema = new Schema({
    name: {type: String, required: true},
    judges: [String], 
    dates: {
        start_date: {type: Date, required: true},
        end_date: {type: Date, required: true}
    },
    registered_commands: [TeamSchema],
    free_places: {type: Number, required: true},
    form_link: {type: String, required: true}
})
const Future_tournament = mongoose.model('Future_tournament', Future_tournament_Schema)
module.exports = Future_tournament