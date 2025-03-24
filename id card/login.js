// Store a simple password hash (in a real app, this should be server-side)
const CORRECT_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // This is 'password'

// Function to hash the password using SHA-256
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const hashedPassword = await hashPassword(password);
    
    if (hashedPassword === CORRECT_PASSWORD_HASH) {
        // Store authentication state
        sessionStorage.setItem('authenticated', 'true');
        // Show the main content
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        alert('Incorrect password!');
    }
}

// Check authentication status on page load
function checkAuth() {
    const authenticated = sessionStorage.getItem('authenticated') === 'true';
    document.getElementById('loginScreen').style.display = authenticated ? 'none' : 'flex';
    document.getElementById('mainContent').style.display = authenticated ? 'block' : 'none';
}

// Initialize the page
window.addEventListener('load', checkAuth);