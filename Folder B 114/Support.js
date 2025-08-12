document.getElementById('support-username').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('confirm-username-btn').click();
    }
});

document.getElementById('confirm-username-btn').onclick = function() {
    const username = document.getElementById('support-username').value.trim();
    if (username) {
        document.getElementById('question-group').style.display = 'block';
        document.getElementById('submit-btn').style.display = 'inline-block';
        document.getElementById('support-username').disabled = true;
        this.style.display = 'none';
    } else {
        alert('Please enter your username.');
    }
};

document.getElementById('support-form').onsubmit = function(e) {
    e.preventDefault();
    // Placeholder: refresh page to simulate redirect to dashboard
    window.location.reload();
};