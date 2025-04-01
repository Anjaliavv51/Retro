// Function to enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    
    const body = document.querySelector('body');
    if (body) body.classList.add('dark-mode')

    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    }
    if (toggleText) toggleText.textContent = ' Dark Mode';

    localStorage.setItem('dark-mode', 'enabled'); // Save preference
}

// Function to disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    
    const body = document.querySelector('body');
    if (body) body.classList.remove('dark-mode');

    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    }
    if (toggleText) toggleText.textContent = ' Light Mode';

    localStorage.setItem('dark-mode', 'disabled'); // Save preference
}

// Apply saved dark mode preference on page load
if (localStorage.getItem('dark-mode') === 'enabled') {
    enableDarkMode();
}

// Dark Mode Toggle Event
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
}
