function display_results(results){
    const table = document.getElementById('results')
    table.innerHTML = `
        <tr>
            <th>Місце</th>
            <th>Назва команди</th>
        </tr>
    `
    results.forEach(({place, command_name}) => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${place}</td>
            <td>${command_name}</td>
        `
        table.appendChild(row)
    } )
}
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    
    try {
        const response = await fetch(`https://man-prodebate.onrender.com/get_tour_info/${tourId}`);
        if (!response.ok) {
            throw new Error('Сетевая ошибка при получении данных о турнире');
        }
        
        const data = await response.json();
        console.log(data);
        console.log("Start Date:", data.start_date);
        console.log("End Date:", data.end_date);

        const { start_date, end_date } = data.dates || {};
        const startDate = start_date ? new Date(start_date).toLocaleDateString('uk-UA') : 'Невідома дата';
        const endDate = end_date ? new Date(end_date).toLocaleDateString('uk-UA') : 'Невідома дата';

        document.getElementById('tournament-name').innerText = data.name;
        document.getElementById('judges').innerText = data.judges.join(', ');
        document.getElementById('start-date').innerText = startDate;
        document.getElementById('end-date').innerText = endDate;
        
        const tournamentEndDate = new Date(data.dates.end_date);
        const currentDate = new Date()

        if (data.topics) {
            document.getElementById('topics').innerText = data.topics.join('; ');
        }

        if (data.results) {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';
            const resultsTable = document.createElement('table');
            resultsTable.innerHTML = `<tr><th>Місце</th><th>Команда</th></tr>`;

            data.results.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${result.place}</td><td>${result.command_name.join(', ')}</td>`;
                resultsTable.appendChild(row);
            });
            resultsContainer.appendChild(resultsTable);
        }

        const userResponse = await fetch('http://localhost:5000/get_user_data', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!userResponse.ok) {
            throw new Error('Ошибка сети при получении данных пользователя');
        }

        const userData = await userResponse.json();
        console.log("пользователь", userData.nickname)
        console.log(data.dates.end_date)
        // если организатор - отображать кнопку
        if ((data.judges.includes(userData.nickname) && tournamentEndDate < currentDate)){
            const add_resolution_btn = document.getElementById('add_resolutions')
            add_resolution_btn.style.display = 'block'
            add_resolution_btn.addEventListener('click', async () => {
                const resolutionInput = prompt("Введіть резолюції через крапку з комою:")
                if (resolutionInput) {
                    const resolutionsArray = resolutionInput.split('; ').map(res => res.trim()) 
                    const response = await fetch(`http://localhost:5000/add_resolutions/${tourId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ resolutions: resolutionsArray })
                        //body: JSON.stringify({ resolutions: resolutionInput.split('; ').map(res => res.trim()) })
                })
                if (!response.ok) {
                    throw new Error('Помилка при додаванні резолюцій')
                }
                const data = await response.json();
                alert('Резолюції додані!');
                location.reload(true)
                if (data.topics){
                    const topicsDiv = document.getElementById('topics');
                    topicsDiv.innerText = resolutionsArray.join('; ')
                } else {
                    console.log('Резолюції не знайдено')
                }
                }
            })
            const add_results_btn = document.getElementById('add_results')
            add_results_btn.style.display = 'block'
            add_results_btn.addEventListener('click', async () => {
            const resultsInput = prompt("Введіть результати у форматі: Місце-Команда; Місце-Команда");
                if (resultsInput) {
                    const results = resultsInput.split('; ').map(entry => {
                        const [place, command] = entry.split('-');
                        return { place: Number(place.trim()), command_name: command.trim() };
                    });
                    const response = await fetch(`http://localhost:5000/add_results/${tourId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ results })
                    })
                    if (!response.ok) {
                        throw new Error('Помилка при додаванні резолюція')
                    }
                    const data = await response.json();
                    alert('Результати додані!');
                    //location.reload(true)
                    console.log("Результати після додавання:", data.results)
                    display_results(data.results)
                }
            })
        }
    } catch (error) {
        console.error(error);
    }
})