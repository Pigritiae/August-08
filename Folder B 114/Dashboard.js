document.addEventListener('DOMContentLoaded', () => {
    const dashboardUsernameSpan = document.getElementById('dashboard-username');
    const dashboardEmailSpan = document.getElementById('dashboard-email');

    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }
    function isAuthenticated() {
        return getAuthToken() !== null;
    }
    function getLoggedUser() {
        const token = getAuthToken();
        if (!token) return null;
        try {
            const decoded = atob(token);
            const [username] = decoded.split(':');

            const users = getUsers();
            return users.find(u => u.username === username);
        } catch (e) {
            console.error("Error Decoding Token:", e);
            return null;
        }
    }
    if (!isAuthenticated()) {
        window.location.href = 'Login.html';
        return;
    }
    const loggedInUser = getLoggedUser();
    if (loggedInUser) {
        dashboardUsernameSpan.textContent = loggedInUser.username;
        dashboardEmailSpan.textContent = loggedInUser.email;
    } else {
        localStorage.removeItem('authToken');
        window.location.href = 'Login.html';
    }
});