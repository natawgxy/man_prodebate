document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('organize-tournament-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const tour_name = document.getElementById('tournament-name').value
        const judges = document.getElementById('tournament-judges').value
        const places = document.getElementById('tournament-places').value
        const form_link = document.getElementById('form-link').value

        const startDateValue = document.getElementById('start-date').value; // формат YYYY-MM-DD
        const endDateValue = document.getElementById('end-date').value; // формат YYYY-MM-DD
        console.log("Значение даты начала:", startDateValue); 
        console.log("Значение даты окончания:", endDateValue);

        
        const start_date = startDateValue ? new Date(startDateValue).toISOString() : null;
        const end_date = endDateValue ? new Date(endDateValue).toISOString() : null;

        console.log("Значение даты начала:", startDateValue);
        console.log("Значение даты окончания:", endDateValue);
        console.log("Преобразованные даты:", start_date, end_date);

        const data = {
            name: tour_name,
            judges,
            dates: {
                start_date: start_date,
                end_date: end_date
            },
            free_places: places,
            form_link: form_link
        }
        console.log("Отправляемые данные", data)
        const tokenn = localStorage.getItem('token')
        fetch('http://localhost:10000/create_tournament', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenn}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response:', response)
            if (!response.ok){
                throw new Error('Не вдалося створити турнір')
            }
            return response.json()
        })
        .then(data => {
            alert('Турнір успішно створено!')
            window.location.href = 'tournaments.html'
        })
        .catch(error => console.error('Помилка:', error))
    })
})