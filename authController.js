const User = require('./models/User')
const Role = require('./models/Role')
const Club = require('./models/Club')
const FutureTournament = require('./models/Future_tournament')
const PastTournament = require('./models/Past_tournament')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {validationResult} = require('koa-validator');
const {secret} = require("./config")

const OpenAI = require("openai")
require('dotenv').config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const generateAccessToken = (id, nickname) => {
    const payload = {
        id,
        nickname
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
    // expiresIn - сколько живёт токен
}

class authController{
    // все функции при работае с бд - асинхронные await
    // try-catch - для отлавливания ошибок
    async registration(ctx){
        try {
            const {name_and_surname, age, experience, in_club_name = "", role_in_club = "", nickname, password, email} = ctx.request.body
            console.log('Досвід', experience)
            // есть ли пользователь с таким ником
            const candidate = await User.findOne({ $or: [{ nickname }, { email }] })
            if (candidate){
                ctx.status = 400
                ctx.body = {message : "Користувач з таким ніком вже існує"}
                return
            }

            const {goals} = ctx.request.body
            const can_organize_club = goals.includes('organize')
            const can_be_judge = goals.includes('judge')
            if ((can_organize_club || can_be_judge) && experience !== 'one-half-year'){
                ctx.status = 400
                ctx.body = {message : 'alert: Для організації клубу та суддівства необхідний досвід не менше 1,5 року.'}
                return
            }

            const hashPassword = bcrypt.hashSync(password, 7); // хэширование пароля
            //const userRole = await Role.findOne({value : "PARTICIPANT"})
            const parsed_goals = JSON.parse(goals || '[]')
            const user = new User({
                name_and_surname,
                age,
                experience,
                in_club_name,
                role_in_club: role_in_club || "",
                nickname,
                password: hashPassword,
                email,
                goals: parsed_goals
            });
            console.log(user)
            await user.save()
            ctx.body = {message: "Пользователь успешно зареган"}
            ctx.status = 200
        } catch (err){
            console.log(err)
            ctx.status = 400
            ctx.body = {message : 'Registration error'}
        }
    }
    async login(ctx){
        try {
            // вытаскиваем ник и пароль из тела запроса
            const {nickname, password} = ctx.request.body
            const user = await User.findOne({nickname}) // находим пользователя в бд
            if (!user){
                ctx.status = 400
                ctx.body = {message: `Користувача з ніком ${nickname} не знайдено`}
                return
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword){
                ctx.status = 400
                ctx.body = {message: `Введіть правильний пароль`}
                return
            }
            // ._ означает фиксированное значение
            const token = generateAccessToken(user._id, user.nickname)
            ctx.body = {message: 'Ви успішно увійшли в акаунт!', token}
        } catch (err){
            console.log(err)
            ctx.status = 400 
            ctx.body = {message : 'Log in error'}
        }
    }
    async profile(ctx){
        try {
            const tokenn = ctx.headers.authorization
            if (!tokenn){
                ctx.status = 401
                ctx.body = {message : 'Немає токену'}
                return
            }
            const tokennn = tokenn.split(' ')[1]
            if (!tokennn){
                ctx.status = 401
                ctx.body = {message : 'Немає токену'}
                return
            }
            const decoded_token = jwt.verify(tokennn, secret)
            const user_id = decoded_token.id

            const user = await User.findById(user_id)
            if (!user){
                ctx.status = 404
                ctx.body = {message : 'Користувача не знайдено'}
                return
            }
            ctx.body = {
                nickname: user.nickname,
                name_and_surname: user.name_and_surname,
                age: user.age,
                experience: user.experience,
                in_club_name: user.in_club_name,
                role_in_club: user.role_in_club,
                goals: user.goals
            }
        } catch (err) {
            console.log(err)
            ctx.status = 500
            ctx.body = {message : 'Помилка отримання серверу'}
        }
    }

    async create_club(ctx){
        const {club_name, links, club_description, age, experience, schedule} = ctx.request.body
        try {
            const tokenn = ctx.headers.authorization
            if (!tokenn){
                ctx.status = 401
                ctx.body = {message: 'Немає токену'}
                return
            }
            // получение user_id
            const tokennn = tokenn.split(' ')[1];
            const decoded_token = jwt.verify(tokennn, secret);
            const user_id = decoded_token.id;
            const nickname = decoded_token.nickname

            const existing_club = await Club.findOne({ user_id });
            if (existing_club) {
                ctx.status = 400;
                ctx.body = { message: 'Організатор вже має клуб!' };
                return;
            }

            const club = new Club({
                judge_organizator: nickname,
                club_name,
                club_description,
                links,
                age,
                experience,
                schedule
            })
            await club.save()
            await User.updateOne(
                {_id: user_id},
                {
                    $set: {
                        in_club_name: club_name,
                        role_in_club: 'організатор'
                    }
                }
            )
            ctx.body = {message: 'Клуб успішно створений', club_id: club._id}
            ctx.status = 200
        } catch (err) {
            console.log(err)
            ctx.status = 500
            ctx.body = {message: 'Помилка при створенні клубу'}
        }
    }
    async get_club_info(ctx){
        const club_id = ctx.params.id
        try {
            const club = await Club.findById(club_id).populate('participants', 'nickname')
            if (!club){
                ctx.status = 404
                ctx.body = {message: 'Клуб не знайдено'}
                return
            }
            ctx.status = 200
            ctx.body = club
        } catch (err) {
            console.error('Помилка отримання клубу:', err);
            ctx.status = 500;
            ctx.body = {message: 'Помилка серверу'};
        }
    }
    async search_clubs(ctx){
        const {club_name, experience, age} = ctx.query
        console.log("Параметры запроса из клиента:", ctx.query)
        const allClubs = await Club.find({});
        console.log("Все клубы в базе:", allClubs);
        const searchConditions = {};
        if (club_name) searchConditions.club_name = new RegExp(club_name.trim(), 'i')
        if (experience) searchConditions.experience = experience
        if (age) searchConditions.age = age
        console.log("Условия поиска:", searchConditions)
        if (club_name) {
            console.log("Параметр club_name перед регуляркой:", club_name.trim());
            searchConditions.club_name = { $regex: club_name.trim(), $options: "i" };
        }
        console.log("Умови пошуку", searchConditions)
        try {
            const clubs = await Club.find(searchConditions)
            console.log("Найденные клубы", clubs)
            ctx.body = clubs
        } catch (error) {
            console.error('Помилка пошуку:', error);
            ctx.status = 500;
            ctx.body = { message: 'Помилка пошуку' };
        }
    }
    async join_club(ctx){
        try {
            console.log("Інформація про користувача", ctx.state.user)
            const user_id = ctx.state.user.id
            const {club_id} = ctx.request.body
            const club = await Club.findById(club_id)

            if (!club) {
                ctx.status = 404; 
                ctx.body = { message: 'Клуб не знайдено.' };
                return
            }

            if (club.participants.includes(user_id)) {
                ctx.status = 400; 
                ctx.body = { message: 'Ви вже є учасником цього клубу.' };
                return;
            }

            club.participants.push(user_id)
            await club.save()
            
            await User.updateOne(
                {_id: user_id},
                {
                    $set: {
                        in_club_name: club.club_name,
                        role_in_club: "учасник"
                    }
                }
            )

            ctx.status = 200
            ctx.body = { message: 'Ви успішно приєдналися до клубу!' }
        } catch (error) {
            console.error('Error joining club:', error)
            ctx.status = 500
            ctx.body = { message: 'Сталася помилка під час приєднання до клубу.' }
        }
    }
    async create_tournament(ctx){
        const {name, judges, dates, free_places, form_link} = ctx.request.body
        console.log("Назва турніру:", name)
        console.log("Кількість вільних місць:", free_places)
        console.log("Отриманні дати", dates)
        try {
            const org = ctx.state.user.nickname 
            console.log("Організатор:", org)
            const all_judges = [org, ...judges.split(',').map(judge => judge.trim())]
            console.log("Судді:", all_judges)

            const start_date = dates.start_date ? new Date(dates.start_date) : null;
            const end_date = dates.end_date ? new Date(dates.end_date) : null;

            if (isNaN(start_date) || isNaN(end_date)) {
                ctx.status = 400;
                ctx.body = {
                    message: 'Некорректный формат даты'
                };
                return;
            }
            
            const newTournament = new FutureTournament({
                name,
                judges: all_judges,
                dates: {
                    start_date,
                    end_date
                },
                registered_commands: [],
                free_places,
                form_link
            })
            
            await newTournament.save()
            ctx.status = 201
            ctx.body = {
                message: 'Турнір успішно створено!',
                tournament: newTournament
            }
            console.log('Турнір успішно створено!')
        } catch (error) {
            ctx.status = 500
            ctx.body = {
                message: 'Не вдалося створити турнір',
                error: error.message
            }
            console.log(error.message)
        }
    }

    // $lt - меньше чем
    // async get_past_tournaments(ctx){
    //     try {
    //         const tours = await Past_tournament.find({"dates.end_date": {$lt: new Date()}})
    //         ctx.body = tours
    //     } catch (error) {
    //         ctx.status = 500
    //         ctx.body = {message: "Не вдалося завантажити турніри"}
    //     }
    // }
    // // $gte - больше или равно 
    // async get_future_tournaments(ctx){
    //     try {
    //         const tours = await Future_tournament.find({"dates.start_date": {$gte: new Date()}})
    //         ctx.body = tours
    //     } catch (error) {
    //         ctx.status = 500
    //         ctx.body = {message: "Не вдалося завантажити турніри"}
    //     }
    // }

    async movePastTournaments() {
        const now = new Date(); // Поточна дата і час
    
        // Знаходимо турніри, що вже пройшли
        const pastTournaments = await FutureTournament.find({ 'dates.end_date': { $lt: now } });
    
        if (pastTournaments.length > 0) {
            // Створюємо новий масив документів з адаптованою структурою
            const adaptedTournaments = pastTournaments.map(tournament => ({
                name: tournament.name,
                judges: tournament.judges,
                dates: tournament.dates,
                topics: [], // Можна залишити порожнім або заповнити
                results: [] // Можна залишити порожнім або заповнити
            }));
            
            // Додаємо адаптовані турніри до колекції `past_tournaments`
            await PastTournament.insertMany(adaptedTournaments);
    
            // Видаляємо їх з колекції `future_tournaments`
            await FutureTournament.deleteMany({ 'dates.end_date': { $lt: now } });
        }
    }
    

    async get_all_tournaments(ctx) {
        try {
            // Перемещение прошедших турниров в коллекцию `past_tournaments`
            await this.movePastTournaments();

            const futureTournaments = await FutureTournament.find({});
            const pastTournaments = await PastTournament.find({});

            // Формирование ответа
            ctx.body = {
                futureTournaments,
                pastTournaments
            };
            ctx.status = 200;
        } catch (error) {
            console.error("Ошибка при получении турниров:", error);
            ctx.status = 500;
            ctx.body = { message: 'Ошибка сервера при получении турниров' };
        }
    }
    
    
    /*async get_all_tournaments(ctx) {
        try {
            await this.movePastTournaments()
            const futureTournaments = await Future_tournament.find({});
            const pastTournaments = await Past_tournament.find({});
            ctx.body = { futureTournaments, pastTournaments };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: "Помилка сервера при отриманні турнірів" };
        }
    }*/
    
    async get_tour_info(ctx){
        console.log('Received tourId:', ctx.params.id); // Лог ID турніру
        const tourId = ctx.params.id
        try {
            const tournament = await FutureTournament.findById(tourId) || await PastTournament.findById(tourId);
            if (tournament) {
                const startDate = tournament.dates?.start_date ? new Date(tournament.dates.start_date).toISOString() : null;
                const endDate = tournament.dates?.end_date ? new Date(tournament.dates.end_date).toISOString() : null;
                console.log('Start Date:', tournament.dates?.start_date);
                console.log('End Date:', tournament.dates?.end_date);

                ctx.body = {
                    name: tournament.name,
                    judges: tournament.judges,
                    dates: {
                        start_date: startDate,
                        end_date: endDate
                    },
                    topics: tournament.topics,
                    registered_commands: tournament.registered_commands || [],
                    free_places: tournament.free_places,
                    form_link: tournament.form_link
                }
            } else {
                ctx.status = 404;
                ctx.body = {message: "Турнір не знайдено"};
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {message: "Помилка сервера при отриманні турніру"};
        }
    }
    async get_user_data(ctx) {
        try {
            const token = ctx.headers.authorization?.split(' ')[1];
            console.log('токен пользователя', token)
            if (!token) {
                ctx.status = 401;
                ctx.body = { message: 'Необходима авторизация' };
                return;
            }
            const decoded = jwt.verify(token, secret)
            const user = await User.findById(decoded.id).select('-password'); // убираем пароль из ответа
            console.log('user', user)
            if (!user) {
                ctx.status = 404;
                ctx.body = { message: 'Пользователь не найден' };
                return;
            }
            ctx.status = 200;
            ctx.body = {
                id: user._id,
                name: user.name,
                surname: user.surname,
                age: user.age,
                experience: user.experience,
                in_club_name: user.in_club_name,
                role_in_club: user.role_in_club,
                nickname: user.nickname,
                email: user.email
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            ctx.status = 500;
            ctx.body = { message: 'Ошибка сервера' };
        }
    }
    async add_resolutions(ctx){
        const tourId = ctx.params.id
        const {resolutions} = ctx.request.body
        try {
            const tour = await PastTournament.findById(tourId)
            console.log("найденный турик")
            if (!tour){
                ctx.status = 404
                ctx.body = {message: "Турнір не знайдено"}
                return
            }
            tour.topics = resolutions
            console.log("турик", tour)
            await tour.save()
            ctx.body = { message: "Резолюції додані"}
            ctx.status = 200
            console.log("обновлённый турик")
        } catch (error) {
            console.error(error)
            ctx.status = 500
            ctx.body = { message: "Помилка сервера" }
        }
    }
    async add_results(ctx){
        const tourId = ctx.params.id
        const {results} = ctx.request.body
        try {
            const tour = await PastTournament.findById(tourId)
            if (!tour){
                ctx.status = 404
                ctx.body = {message: "Турнір не знайдено"}
                return
            }
            tour.results = results
            const updtour = await tour.save()
            console.log("Результати після додавання:", updtour.results)
            ctx.body = {message: "Результати додано", results: updtour.results}
            ctx.status = 200
        } catch (error) {
            console.error(error)
            ctx.status = 500
            ctx.body = { message: "Помилка сервера" }
        }
    }
    async analyze_speech(ctx){
        try {
            const speech = ctx.request.body
            if (!speech) {
                ctx.status = 400
                ctx.body = { error: "Текст для аналізу не переданий." }
                return;
            }
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { "role": "system", "content": "Ти професійний суддя дебатів." },
                    {
                        "role": "user",
                        "content": `Проаналізуй цей спіч: ${speech}. Оціни його за такими критеріями: вправне формулювання тези, структурованість, послідовність і логічність висловлення думок, вагомість аргументів, дотримання теми, наявність доказів аргументів (приклади з життя, літератури і тд). В кінці визнач досвід гри в дебати користувача: Немає досвіду, Пів року, 1 рік, 1,5 і більше року.`
                    }
                ]
            });
            const analysis = completion.choices[0]?.message?.content
            if (!analysis){
                ctx.status = 500
                ctx.body = {error: "Не вдалося зробити аналіз спіча"}
                return
            }
            ctx.status = 200
            ctx.body = {analysis}
        } catch (error) {
            console.log("Сталася помилка при аналізи вашого спіча", error)
            ctx.status = 500
            ctx.body = { message: "Сталася помилка при аналізи вашого спіча"}
        }
    }
}

// экспортируем объект класса
module.exports = new authController()