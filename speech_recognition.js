const analysis = async(speechText) => {
    try {
        console.log("Такий текст відправляється на сервер для аналізу:", speechText)
        const response = await fetch("https://man-prodebate.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({speech: speechText}) 
        })
        const result = await response.json()
        const debate_experience = ""
        console.log("Відповідь чата джпт:", result)
        const analysisLines = result.analysis.split('\n')
        debate_experience = analysisLines[analysisLines.length - 1]
        localStorage.setItem("debate_experience", debate_experience)
        window.location.href = "registration.html"

        console.log("Відповідь сервера на запит про аналіз спіча:", result)
        const res = document.getElementById('results')
        if (result.analysis){
            res.textContent = result.analysis
        } else 
        if (result.error){
            res.textContent = `Помилка: ${result.error}`
        }
    } catch (error){
        console.log("Помилка запиту", error)
        const res = document.getElementById("results")
        res.textContent = "Сталася помилка при аналізі спіча."
    }
}

const input_text = document.querySelector('.input-text')
const analyze_button = document.getElementById('analyze-button')
analyze_button.addEventListener('click', function(){
    const speech_text = input_text.value
    analysis(speech_text)
})

// const start_button = document.getElementById("start")
// const speach_rec = document.getElementById("recording-indicator")
// const finish_speech = document.getElementById('finish')
// const output = document.getElementById('output')

// let transcription = "" 
// let is_rec_going = false
// let recognition
// function start_rec_session(){ 
//     recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
//     speach_rec.style.display = "block"
//     recognition.lang = 'uk-UA'
//     output.textContent = ""

//     recognition.onstart = () => {
//         console.log("Розпізнавання почато...")
//         is_rec_going = true
//     }
//     recognition.onresult = (event) => {
//         const text = Array.from(event.results)
//             .map((result) => result[0].text)
//             .join("");
//         console.log("Розпізнаний текст:", text)
//         if (text.trim()){
//             transcription += text + " "
//             output.textContent = transcription
//         } else {
//             console.log("Розпізнаний текст порожній")
//         }
//         speach_rec.style.display = "none"
//     }
//     recognition.onerror = (event) => {
//         console.error("Помилка розпізнавання:", event.error)
//         speach_rec.style.display = "none"
//         if (event.error === 'not-allowed') {
//             console.log("Доступ до мікрофону заборонено користувачем або налаштуваннями браузера.")
//             return
//         }
//         if (is_rec_going) {
//             console.log("Спроба перезапуску розпізнавання після помилки...")
//             recognition.start()
//         }
//         is_rec_going = false
//     }
//     recognition.onend = () => {
//         is_rec_going = false
//         speach_rec.style.display = "none"
//         if (is_rec_going) recognition.start(); else {
//             console.log("Розпізнавання завершено")
//             console.log("Розпізнаний текст:", transcription)
//         }
//     }
//     recognition.start()
// }
// finish_speech.addEventListener("click", () => {
//     output.textContent = transcription
//     analysis(transcription)
//     speach_rec.style.display = "none"
//     recognition.stop()
//     console.log("Голосовий ввід завершено")
// })

// function start_rec(time = 5){
//     const tt = time * 60 * 1000
//     is_rec_going = true 
//     transcription = ""
//     setTimeout(() => {
//         is_rec_going = false
//         recognition?.stop()
//     }, tt)
//     start_rec_session()
// }
// start_button.addEventListener('click', () => {
//     start_rec(5)
// })

