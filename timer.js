document.addEventListener('DOMContentLoaded', () => {
    const timer = document.querySelector('.timer')
    let time_left = 15 * 60
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
        const time_interval = setInterval(() => {
            time_left--
            timer.textContent = format_time(time_left)
            if (time_left <= 0){
                clearInterval(time_interval)
                timer.textContent = "Час на підготовку вичерпаний!"
            }
        }, 1000)
    }
    start_timer()
})