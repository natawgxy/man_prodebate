fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        initializeHeader();
    })
    .catch(error => console.error('Error loading header:', error));

function initializeHeader() {
    const token = localStorage.getItem('token');
    console.log('Found token:', token);

    if (token) {
        document.getElementById('signup-button').style.display = 'none';
        document.getElementById('login-button').style.display = 'none';

        document.getElementById('user-menu').style.display = 'block';
    } else {
        document.getElementById('signup-button').style.display = 'block';
        document.getElementById('login-button').style.display = 'block';

        document.getElementById('user-menu').style.display = 'none';
    }
}

function redirectToSearchClubs() {
    window.location.href = 'search.html';
}

function redirectToProfile() {
    window.location.href = 'profile.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
