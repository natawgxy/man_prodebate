document.addEventListener('DOMContentLoaded', () => {
    const timer = document.querySelector('.timer')
    let time_left = 17 * 60
    let timer1_goes = true
    function format_time(seconds){
        const minutes = Math.floor(seconds / 60)
        const sec = seconds % 60
        // padStart - длину строки дополняем нулями
        const minstr = minutes.toString().padStart(2, '0')
        const secstr = sec.toString().padStart(2, '0')
        // $ - превращает в строку
        return `${minstr}:${secstr}`
    }
    function start_timer(){
        // setInterval - функция выполняется через указанные миллисекунды
        const time_interval = setInterval(() => {
            time_left--
            timer.textContent = format_time(time_left)
            if (time_left <= 0){
                clearInterval(time_interval)
                timer1_goes = false
                timer.textContent = "Час на підготовку вичерпаний!"
            }
        }, 1000)
    }
    const timer2 = document.querySelector('.timer2')
    let time_left2 = 5 * 60
    function start_second_timer(){
        const timer_interval = setInterval(() => {
            time_left2--
            timer2.textContent = format_time(time_left2)
            if (time_left2 <= 0){
                clearInterval(time_interval)
                timer.textContent = "Час на виступ вичерпаний! Очікуйте результати"
            }
        }, 1000)
    }
    function role_generation(){
        const map = new Map()
        map.set(0, "опозицію (виступаєте 'проти' теми)")
        map.set(1, "уряд (виступаєте 'за' тему)")
        let ind = Math.floor(Math.random() * 2)
        return map.get(ind)
    }
    function topic_generation(){
        const topics = [
            "Інфослайд: Пᴇᴩᴄᴏнᴀж хʙᴏᴩіє нᴀ ᴩᴀᴋ. Ліᴋᴀᴩ ᴋᴀжᴇ йᴏʍу, щᴏ йᴏʍу ɜᴀᴧиɯиᴧᴏᴄь жиᴛи щᴇ ᴏдин ᴩіᴋ. У ᴨᴇᴩᴄᴏнᴀжᴀ є ʙибіᴩ: ᴨᴩᴏʙᴇᴄᴛи ᴏᴄᴛᴀнні чᴀᴄи ᴄʙᴏᴦᴏ жиᴛᴛя ɜ ᴄіʍ'єю чи ʙиᴩуɯиᴛи у нᴀʙᴋᴏᴧᴏᴄʙіᴛню ᴨᴏдᴏᴩᴏж. Резолюція:Ця Пᴀᴧᴀᴛᴀ ʙʙᴀжᴀє, щᴏ ᴨᴏᴛᴩібнᴏ ɜᴀᴧиɯиᴛиᴄь вдᴏʍа",
            "Резолюція: Ця Пᴀᴧᴀᴛᴀ ʙʙᴀжᴀє, щᴏ ᴨᴏᴛᴩібнᴏ Діду Мᴏᴩᴏɜу (Сʙяᴛᴏʍу Миᴋᴏᴧᴀю) 'ᴩᴏɜбиᴩᴀᴛиᴄя' ɜ діᴛьʍи ɜі ᴄᴨиᴄᴋу 'ᴨᴏᴦᴀнціʙ'",
            "Інфослайд: Ви диᴛинᴀ - 10 ᴩᴏчᴋіʙ. Жиʙᴇᴛᴇ у ᴄучᴀᴄнᴏʍу Хᴀᴩᴋᴏʙі. Вᴀɯі бᴀᴛьᴋи ᴨᴩᴏᴨᴏнуюᴛь Вᴀʍ ʙиїхᴀᴛи ɜᴀ ᴋᴏᴩдᴏн. Нᴀ яᴋий ᴛᴇᴩʍін нᴇ ʙідᴏʍᴏ. Резолюція: ЦП ʙʙᴀжᴀє, щᴏ ᴨᴏᴛᴩібнᴏ ᴨᴏᴦᴏдиᴛиᴄя нᴀ ᴨᴩᴏᴨᴏɜицію.",
            "Резолюція: Ця Палата вважає, що бальне оцінювання не сприяє розвитку учнів та не є ефективним в освітньому процесі"
        ]
        let ind = Math.floor(Math.random() * topics.length)
        return topics[ind]
    }
    function set_role(){
        const role = document.querySelector('.role')
        role.textContent = role_generation()
    }
    function set_topic(){
        const topic = document.querySelector('.topic')
        topic.textContent = topic_generation()
    }
    set_role()
    set_topic()
    start_timer()
    if (timer1_goes === false) start_second_timer()
})
