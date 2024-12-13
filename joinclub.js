document.addEventListener('DOMContentLoaded', () => {
    const joinClubButton = document.getElementById('join-club');

    if (joinClubButton) {
        joinClubButton.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search)
            const clubId = urlParams.get('id')
            const response = await fetch('http://localhost:10000/join_club', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ club_id: clubId })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message)
                location.reload()
            } else {
                alert(data.message)
            }
        });
    }
});
