const jwt = require('jsonwebtoken')
const {secret} = require('../config')

// делаем чтобы методу getUsers доступ был только у админа
module.exports = function(roles){
    return function(ctx, next){
        if (ctx.method === "OPTIONS"){
            return next()
        }
        try {
            const token = ctx.headers.authorization.split(' ')[1]
            if (!token){
                ctx.status = 403
                ctx.body = {message: "Користувач не зареєстрований"}
                return
            }
            const {roles: userRoles} = jwt.verify(token, secret)
            // есть ли в списке ролей те роли, которые разрешены для этой функи
            const hasRole = userRoles.some(role => roles.includes(role));
            if (!hasRole) {
                ctx.status = 403
                ctx.body = { message: "Ви не маєте доступу до цього функціоналу" }
                return
            }
            return next()
        } catch (err){
            console.log(err)
            ctx.status = 403
            ctx.body = {message: "Користувач не зареєстрований"}
        }
    }
}