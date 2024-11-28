const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = async function(ctx, next) {
    try {
        const authHeader = ctx.headers.authorization;
        if (!authHeader) {
            ctx.status = 403;
            ctx.body = { message: "Користувач не зареєстрований" };
            return;
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            ctx.status = 403;
            ctx.body = { message: "Користувач не зареєстрований" };
            return;
        }
        
        const decodedData = jwt.verify(token, secret);
        ctx.state.user = decodedData
        await next();
    } catch (err) {
        console.log('Помилка авторизації:', err);
        ctx.status = 403;
        ctx.body = { message: "Користувач не зареєстрований" };
    }
}
