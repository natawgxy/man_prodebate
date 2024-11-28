const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')
const ClubSchema = new Schema({
    judge_organizator: {type: String, required: true},
    club_name: {type: String, required: true},
    club_description: {type: String, required: false},
    links : {type: String, required: false},
    age: {type: String, required: true},
    experience: {type: String, required: true},
    schedule: {type: String, required: true},
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})
const Club = mongoose.model('Club', ClubSchema);
module.exports = Club;