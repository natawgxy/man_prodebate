document.addEventListener('DOMContentLoaded', function() {
    const tokenn = localStorage.getItem('token')
    if (!tokenn){
        alert('Увійдіть в систему')
        window.location.href = 'login.html'
        return
    }
    const nickname = localStorage.getItem('nickname')
    fetch(`https://man-prodebate.onrender.com/profile?nickname=${nickname}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tokenn}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                if (err.message.startsWith('alert: ')) {
                    alert(err.message.replace('alert: ', '')); // удаляем alert: перед показом сообщения
                }
                throw new Error(err.message);
            });
        }
        return response.json(); 
    })    
    .then(data => {
        experienceMap = {
            'no-experience': 'Немає досвіду',
            'half-year': 'Пів року',
            'one-year': '1 рік',
            'one-half-year': '1,5 і більше року'
        };
        const experienceText = experienceMap[data.experience]

        console.log('Інформація про користувача')
        document.getElementById('nickname').textContent = data.nickname
        document.getElementById('name-and-surname').textContent = data.name_and_surname;
        document.getElementById('age').textContent = data.age
        document.getElementById('experience').textContent = experienceText
        document.getElementById('in_club_name').textContent = data.in_club_name
        document.getElementById('role_in_club').textContent = data.role_in_club

        const goals = data.goals || []
        const club_name = data.in_club_name || ''
        const organizeClubButton =  document.getElementById('organize-club')
        const organizeTournamentButton = document.getElementById('organize-tournament-btn')
        const searchClubButton = document.getElementById('search-club-btn')
        if (data.role_in_club === 'організатор' && club_name){
            organizeClubButton.style.display = 'none'
        } else if (!club_name && goals.includes('organize')){
            organizeClubButton.style.display = 'block' // делаем кнопку отображаемой
            organizeTournamentButton.style.display = 'block'

            organizeClubButton.addEventListener('click', function() {
                window.location.href = 'organize_club.html'; 
            })
        }
        if (goals.includes('judge')){
            organizeTournamentButton.style.display = 'block'
            organizeTournamentButton.addEventListener('click', function(){
                window.location.href = 'organize_tournament.html'
            })
        }
        if (data.role_in_club !== 'організатор' && !club_name){
            searchClubButton.style.display = 'block'
            searchClubButton.addEventListener('click', function(){
                window.location.href = 'search.html'
            })
        }
        if (data.role_in_club === 'організатор'){
            searchClubButton.style.display = 'none'
        }
    })
    .catch(error => console.error('Помилка:', error))
})