document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('create-club-button').addEventListener('click', function(event){
        event.preventDefault()

        const club_name = document.getElementById('club_name').value 
        const club_description = document.getElementById('club_desciption').value
        const age = document.getElementById('age').value
        const experience = document.getElementById('experience').value
        const schedule = document.getElementById('schedule').value
        const links = document.getElementById('links').value

        const data = {
            club_name,
            club_description,
            links,
            age,
            experience,
            schedule
        }
        const tokenn = localStorage.getItem('token')
        fetch('https://man-prodebate.onrender.com/create_club', {
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
                throw new Error('Не вдалося створити клуб')
            }
            return response.json()
        })
        .then(data => {
            console.log('Data:', data);
            if (data.message) {
                alert(data.message);
                const club_id = data.club_id
                console.log('club_id:', club_id)
                // перенаправление на страницу клуба
                console.log('Redirecting to:', `/club_info.html?id=${club_id}`);
                window.location.href = `/club_info.html?id=${club_id}`
            }
        })
        .catch(error => {
            console.error('Помилка створення клубу:', error);
            alert('Помилка створення клубу')
        })
    })  
})