document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search)
    const clubId = urlParams.get('id')
    console.log('Club ID:', clubId);

    fetch(`https://man-prodebate.onrender.com/getclubinfo/${clubId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевая ошибка при получении данных о клубе');
            }
            return response.json();
        })
        .then(async data => {
            document.getElementById('club_name').innerText = data.club_name || 'Не вказано';
            document.getElementById('judge_organizator').innerText = data.judge_organizator || 'Не вказано';
            document.getElementById('club_description').innerText = data.club_description || 'Не вказано';

            const linksDisplay = document.getElementById('links')
            linksDisplay.innerHTML = ''
            if (data.links) { 
                // для создания активной ссылкb
                const linkElement = document.createElement('a');
                linkElement.href = data.links
                linkElement.target = '_blank'
                linkElement.innerText = data.links
                linksDisplay.appendChild(linkElement)
            }
            const participantsDisplay = document.getElementById('participants')
            participantsDisplay.innerHTML = ''
            data.participants.forEach(participant => {
                const displayText = participant.nickname
                const participantElement = document.createElement('div')
                participantElement.innerText = displayText
                participantsDisplay.appendChild(participantElement)
            })
            const token = localStorage.getItem('token');
            if (token) {
                const userResponse = await fetch('http://localhost:5000/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    const isParticipant = (userData.in_club_name === data.club_name) && (userData.role_in_club === 'учасник')
                    const isOrganizer = (userData.role_in_club === 'організатор' && userData.in_club_name !== '')

                    if (!isParticipant && !isOrganizer) {
                        document.getElementById('join-club').classList.remove('hidden');
                    }
                }
            }
        })
        .catch(error => {
            console.error('Помилка завантаженння інформації клубу:', error);
            alert('Помилка завантаженння інформації клубу')
        });
});
