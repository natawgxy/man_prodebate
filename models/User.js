const {Schema, model} = require('mongoose')
// Schema - описывает то, как пользователь будет хранится в бд
// каждая роль у пользователя будет ссылаться на другую сущность - роли
const User = new Schema({
    name_and_surname : {type : String, required : true},
    age : {type : Number, required : true},
    experience : {type: String, required : true},
    in_club_name: {type : String, default : ""},
    role_in_club: {type : String, default : "", enum: ['', 'учасник', 'організатор']},
    nickname: {type: String, unique : true, required : true},
    password : {type : String, required : true},
    email : {type: String, unique: true, required : true},
    goals: { type: [String], default: [] }
})
// (название, схема)
module.exports = model('User', User)