document.addEventListener('DOMContentLoaded', function() {
    const check_skills = document.getElementById('check-skills-btn')
    check_skills.addEventListener('click', function(){
        window.location.href = 'check_skills.html'
    })

    document.getElementById('registration-form').addEventListener('submit', function(event){
        event.preventDefault(); 
        const form = document.getElementById('registration-form');
        const form_data = new FormData(form);

        const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(goal => goal.value);
        form_data.set('goals', JSON.stringify(goals)); 

        fetch('http://localhost:10000/registration', {
            method: 'POST',
            body: form_data
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json().then(data => ({ status: response.status, data }))
        })
        .then(({ status, data }) => {
            console.log('Response data:', data)
            if (status >= 400) {
                alert('Помилка: ' + data.message)
            } else {
                alert('Ви успішно зареєструвалися!')
                window.location.href = `login.html`
            }
        })
        .catch(error => console.error('Помилка:', error))
    })
})
