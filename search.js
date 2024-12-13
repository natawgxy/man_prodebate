function searchClubs(){
    const club_name = document.getElementById('club-name').value
    const experience = document.getElementById('experience').value
    const age = document.getElementById('age').value

    const searchParams = {
        club_name: club_name || '',
        experience: experience || '',
        age: age || ''
    }
    console.log('Параметры запроса:', searchParams)
    fetch(`http://localhost:10000/search_clubs?${new URLSearchParams(searchParams)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Помилка пошуку клубів')
        }
        return response.json()
    })
    .then(data => {
        const resultsDiv = document.querySelector('.results')
        resultsDiv.innerHTML = ''

        if (data.length === 0) {
            resultsDiv.innerText = 'Клуби не знайдено за вказаними критеріями';
            return;
        }

        data.forEach(club => {
            const clubDiv = document.createElement('div');
            clubDiv.classList.add('club');

            const detailsButton = document.createElement('button')
            detailsButton.innerText = 'Детальніше'
            detailsButton.onclick = function(){
                window.location.href = `club_info.html?id=${club._id}`
            }
            clubDiv.innerHTML = `
                <h2>${club.club_name}</h2>
                <p>${club.club_description || 'Без опису'}</p>
            `;
            clubDiv.appendChild(detailsButton)
            resultsDiv.appendChild(clubDiv)
        });
    })
    .catch(error => {
        console.error('Помилка пошуку:', error);
        alert('Помилка пошуку');
    });
}