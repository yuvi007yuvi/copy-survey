// Login handling
function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    // For demo purposes, using a simple password
    const correctPassword = 'admin123'; // In production, this should be handled securely
    
    if (password === correctPassword) {
        // Hide login screen
        document.getElementById('loginScreen').style.display = 'none';
        // Show main content
        document.getElementById('mainContent').style.display = 'block';
        // Store login state
        sessionStorage.setItem('isLoggedIn', 'true');
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
    }
});