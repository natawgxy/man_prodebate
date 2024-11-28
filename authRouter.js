const Koa = require('koa')
const Router = require('@koa/router')
const controller = require('./authController')
const {check, validationResult} = require('koa-validator');
const Joi = require('joi');
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
const koaBody = require('koa-body').default;

// const app = new Koa()
const router = new Router()
//app.use(router.routes()).use(router.allowedMethods());
//app.use(koaBody())
// joi - для валидации
const registrationSchema = Joi.object({
    name_and_surname: Joi.string()
        .pattern(/^[A-Za-zА-Яа-яІіЇїЄєҐґ\s]+$/) // Allows only letters and spaces
        .trim()
        .min(1)
        .required()
        .messages({
            'string.empty': 'Ім\'я та прізвище не можуть бути порожніми',
            'string.pattern.base': 'Ім\'я та прізвище не можуть містити цифри'
        }),
    age: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Вік повинен бути числом',
            'number.min': 'Вік повинен бути додатнім числом'
        }),
    experience: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Досвід в дебатах не може бути порожнім'
        }),
    nickname: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            'string.empty': 'Нік не може бути порожнім'
        }),
    password: Joi.string()
        .trim()
        .min(4)
        .max(10)
        .required()
        .messages({
            'string.empty': 'Пароль не може бути порожнім',
            'string.min': 'Пароль повинен містити від 4 символів',
            'string.max': 'Пароль повинен містити не більше 10 символів'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Електронна пошта не може бути порожньою',
            'string.email': 'Електронна пошта повинна бути валідною'
        })
}).unknown();



router.post('/registration', koaBody(), async (ctx, next) => {
    console.log('Маршрут /registration сработал');
    console.log('Тело запроса:', ctx.request.body);
    const { error } = registrationSchema.validate(ctx.request.body);
    if (error) {
        ctx.status = 400
        ctx.body = { message: error.details.map(err => err.message) };
        return
    }
    await controller.registration(ctx);
});


router.post('/login', controller.login)
router.get('/profile', controller.profile)
router.post('/create_club', controller.create_club)
router.get('/getclubinfo/:id', controller.get_club_info)
router.get('/search_clubs', controller.search_clubs)
router.post('/join_club', authMiddleware, controller.join_club)
router.post('/create_tournament', authMiddleware, controller.create_tournament)
// router.get('/get_past_tournaments', controller.get_past_tournaments)
// router.get('/get_future_tournaments', controller.get_future_tournaments)
router.get('/get_all_tournaments', controller.get_all_tournaments.bind(controller))
router.get('/get_user_data', controller.get_user_data)
router.get('/get_tour_info/:id', controller.get_tour_info)
router.post('/add_resolutions/:id', controller.add_resolutions)
router.post('/add_results/:id', controller.add_results)


module.exports = router