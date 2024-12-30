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

const start_button = document.getElementById("start")
const speach_rec = document.getElementById("recording-indicator")
const finish_speech = document.getElementById('finish')
const output = document.getElementById('output')

let transcription = "" 
let is_rec_going = false
let recognition
function start_rec_session(){ 
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    speach_rec.style.display = "block"
    recognition.lang = 'uk-UA'
    output.textContent = ""

    recognition.onstart = () => {
        console.log("Розпізнавання почато...")
        is_rec_going = true
    }
    recognition.onresult = (event) => {
        const text = Array.from(event.results)
            .map((result) => result[0].text)
            .join("");
        console.log("Розпізнаний текст:", text)
        speach_rec.style.display = "none"
        transcription += text + " "
    }
    recognition.onerror = (event) => {
        console.error("Помилка розпізнавання:", event.error)
        speach_rec.style.display = "none"
        is_rec_going = false
    }
    recognition.onend = () => {
        speach_rec.style.display = "none"
        if (!is_rec_going) start_rec_session(); else {
            console.log("Розпізнавання завершено")
            console.log("Розпізнаний текст:", transcription)
        }
    }
    finish_speech.addEventListener("click", () => {
        output.textContent = transcription
        analysis(transcription)
        speach_rec.style.display = "none"
        recognition.stop()
        console.log("Голосовий ввід завершено")
    })
    recognition.start()
}
function start_rec(time = 5){
    const tt = time * 60 * 1000
    is_rec_going = true 
    transcription = ""
    setTimeout(() => {
        is_rec_going = false
        recognition?.stop()
    }, tt)
    start_rec_session()
}
start_button.addEventListener('click', () => {
    start_rec(5)
})

