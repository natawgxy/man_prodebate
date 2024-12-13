document.addEventListener('DOMContentLoaded', function() {
    fetch('https://man-prodebate.onrender.com/get_all_tournaments')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // будущие турики
            const futureTableBody = document.getElementById('future-tournaments-table').getElementsByTagName('tbody')[0];
            futureTableBody.innerHTML = ''; 
            data.futureTournaments.forEach(tournament => {
                const row = futureTableBody.insertRow();
                row.innerHTML = `
                <td>${tournament.name}</td>
                <td>${tournament.judges.join(', ')}</td>
                <td>${new Date(tournament.dates.start_date).toLocaleDateString()}</td>
                <td>${new Date(tournament.dates.end_date).toLocaleDateString()}</td>
                <td>${tournament.free_places}</td>
                <td>
                    <a href="${tournament.form_link}" class="register-button" target="_blank">Зареєструватися</a>
                </td>
                `;
                row.addEventListener('click', () => {
                    window.location.href = `tour_info.html?id=${tournament._id}`;
                });
            });

            // прошедшие турики
            const pastTableBody = document.getElementById('past-tournaments-table').getElementsByTagName('tbody')[0];
            pastTableBody.innerHTML = ''; 
            data.pastTournaments.forEach(tournament => {
                const row = pastTableBody.insertRow();
                row.innerHTML = `<td>${tournament.name}</td><td>${tournament.judges.join(', ')}</td><td>${new Date(tournament.dates.start_date).toLocaleDateString()}</td><td>${new Date(tournament.dates.end_date).toLocaleDateString()}</td><td>${tournament.topics.join(', ')}</td>`;
                row.addEventListener('click', () => {
                    window.location.href = `tour_info.html?id=${tournament._id}`;
                });
            });
        })
        .catch(error => console.error('Error fetching tournament data:', error));
});


// document.addEventListener('DOMContentLoaded', async function() {
//     async function fetchTournaments(url) {
//         const response = await fetch(url, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//         })
//         return response.json()
//     }

//     async function populateTable(tournaments, tableId) {
//         const tableBody = document.getElementById(tableId).querySelector('tbody')
//         tableBody.innerHTML = ''
//         tournaments.forEach(tournament => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${tournament.name}</td>
//                 <td>${new Date(tournament.dates.start_date).toLocaleDateString()}</td>
//                 <td>${new Date(tournament.dates.end_date).toLocaleDateString()}</td>
//                 <td>${tournament.judges.join(', ')}</td>
//                 <td>${tableId === 'future-tournaments-table' ? tournament.free_places : tournament.registered_commands.length}</td>
//             `;
//             row.addEventListener('click', () => {
//                 window.location.href = `tour_info.html?id=${tournament._id}`
//             })
//             tableBody.appendChild(row)
//         })
//     }

//     try {
//         const futureTournaments = await fetchTournaments('http://localhost:5000/get_future_tournaments')
//         populateTable(futureTournaments, 'future-tournaments-table')

//         const pastTournaments = await fetchTournaments('http://localhost:5000/get_past_tournaments')
//         populateTable(pastTournaments, 'past-tournaments-table')
//     } catch (error) {
//         console.error('Помилка завантаження турнірів:', error)
//     }
// })