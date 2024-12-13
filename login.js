document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const form = document.getElementById('login-form');
        const form_data = new FormData(form);

        fetch('https://man-prodebate.onrender.com/login', {
            method: 'POST',
            body: form_data
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json()
        })
        .then(data => {
            console.log('Response data:', data);
            // if (data.message) {
            //     alert('Помилка: ' + data.message);
            if (data.token) { // если есть токен, значит вход успешен
                alert('Ви успішно увійшли!');
                localStorage.setItem('token', data.token); // сохранили токен
                //window.location.reload()
                window.location.href = 'profile.html'; // перенаправление на страницу профиля
            } else {
                alert('Невідома помилка');
            }
        })
        .catch(error => console.error('Помилка:', error));
    })
})