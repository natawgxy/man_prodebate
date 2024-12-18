const analysis = async(speechText) => {
    try {
        const response = await fetch("https://man-prodebate.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({speech: speechText}) 
        })
        const result = await response.json()
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
start_button.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    let transcription = "" 
    speach_rec.style.display = "block"
    recognition.lang = 'uk-UA'
    output.textContent = ""
    recognition.onresult = (event) => {
        transcription = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
        console.log("Розпізнаний текст:", transcription)
        output.textContent = transcription
        speach_rec.style.display = "none"
        analysis(transcription)
    }
    recognition.onerror = (event) => {
        console.error("Помилка розпізнавання:", event.error)
        speach_rec.style.display = "none"
    }
    recognition.onend = () => {
        speach_rec.style.display = "none"
    }
    finish_speech.addEventListener("click", () => {
        output.textContent = transcription
        analysis(transcription)
        speach_rec.style.display = "none"
        recognition.stop()
    })
    recognition.start()
})

