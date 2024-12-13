const analysis = async(speechText) => {
    try {
        const response = await fetch("http://localhost:5000/analyze", {
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
start_button.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    let transcription = "" 
    speach_rec.style.display = "block"
    recognition.lang = 'uk-UA'
    recognition.onresult = (event) => {
        transcription = event.results[0][0].transcript
        speach_rec.style.display = "none"
        analysis(transcription)
    }
    recognition.onerror = (event) => {
        console.error("Помилка розпізнавання:", event.error)
        speach_rec.style.display = "none"
    }
    recognition.onend = () => {
        speach_rec.style.display = "none";
    }
    finish_speech.addEventListener("click", () => {
        recognition.stop()
    })
    recognition.start()
})

