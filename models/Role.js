const {Schema, model} = require('mongoose')
// роли: учасник, организатор, админ
const RoleSchema = new Schema({
    value: { 
        type: String, 
        unique: true, 
        enum: ['', 'учасник', 'організатор'], // определяем допустимые значения для роли
        default: '' 
    }
});
// (название, схема)
module.exports = model('Role', RoleSchema)