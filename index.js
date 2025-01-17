const Koa = require('koa');
const koaBody = require('koa-body').default;
const authRouter = require('./authRouter')
const mongoose = require('mongoose');
const cors = require('@koa/cors');
const serve = require('koa-static')
const path = require('path')
const authController = require('./authController');
require('dotenv').config()

// URL для подключения к MongoDB
const dbUrl = process.env.DB_URL
const port = process.env.PORT || 10000;
const app = new Koa();

app.use(serve(path.join(__dirname, './man_debate')));

// app.use(cors({
//   origin: 'http://127.0.0.1:10000'
// }))
// app.use(cors({
//   origin: 'https://man-prodebate.onrender.com/'
// }))
app.use(cors({
  origin: (ctx) => {
    const allowedOrigins = [
      'http://127.0.0.1:5500', 
      'https://man-prodebate.onrender.com/'
    ];
    const requestOrigin = ctx.headers.origin;
    if (allowedOrigins.includes(requestOrigin)) {
      return requestOrigin;
    }
    return 'https://man-prodebate.onrender.com/';
  },
  credentials: true,
}));

app.use(koaBody({
  multipart: true, 
  urlencoded: true 
})); 

app.use(async (ctx, next) => {
  console.log('Метод:', ctx.method);
  console.log('URL:', ctx.url);
  console.log('Заголовки:', ctx.headers);
  await next();
});
// app.use("/auth", authRouter)
app.use(authRouter.routes());          
app.use(authRouter.allowedMethods());

app.use(require('koa-static')('./'))

const cron = require('node-cron');

// Run update every day at midnight
cron.schedule('0 0 * * *', () => {
    authController.updatePastTournaments();
});

// Функция для подключения к MongoDB и запуска сервера
async function startServer() {
  try {
    // Подключение к MongoDB
    await mongoose.connect(dbUrl)
    console.log('Connected to MongoDB');

    // Запуск Koa-сервера
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
startServer();
