const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')
const Past_tournament_Schema = new Schema({
    name: {type: String, required: true},
    judges: [String], // массив из строк
    dates: {
        start_date: {type: Date, required: true},
        end_date: {type: Date, required: true}
    },
    topics: [String], // в виде файла
    results: [{
        place: {type: Number, required: true},
        command_name: {type: String, required: true}
    }]

})
const Past_tournament = mongoose.model('Past_tournament', Past_tournament_Schema)
module.exports = Past_tournament