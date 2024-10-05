document.addEventListener('DOMContentLoaded', (event) => {
    const htmlElement = document.documentElement;
    const switchElement = document.getElementById('darkModeSwitch');

    const currentTheme = localStorage.getItem('bsTheme') || 'light'; // Default to light
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    switchElement.checked = currentTheme === 'dark';

    // Update section background color based on theme
    const updateSectionBackgrounds = () => {
        const sections = document.querySelectorAll('.section');
        
        if (currentTheme === 'dark') { 
            // body.style.updateSectionBackgrounds = 'black';
            sections.forEach(section => {
                // section.setAttribute('style', 'background-color: black;');
                section.backgroundColor = 'black'; // Dark mode background
            });
        } else {
            sections.forEach(section => {
                // section.setAttribute('style', 'background-color: #f0f0f0;');
                section.backgroundColor = 'pink'; // Light mode background
            });
        }
    };

    updateSectionBackgrounds(); // Initial call

    switchElement.addEventListener('change', function () {
        if (this.checked) {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('bsTheme', 'dark');
            updateSectionBackgrounds(); // Update backgrounds
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('bsTheme', 'light');
            updateSectionBackgrounds(); // Update backgrounds
        }
    });
});

// document.addEventListener('DOMContentLoaded', (event) => {
//     const htmlElement = document.documentElement;
//     const switchElement = document.getElementById('darkModeSwitch');

//     // Set the default theme to dark if no setting is found in local storage
//     const currentTheme = localStorage.getItem('bsTheme') || 'dark';
//     htmlElement.setAttribute('data-bs-theme', currentTheme);
//     switchElement.checked = currentTheme === 'dark';

//     // Listen for changes on the switch
//     switchElement.addEventListener('change', function () {
//         if (this.checked) {
//             htmlElement.setAttribute('data-bs-theme', 'dark');
//             localStorage.setItem('bsTheme', 'dark');
//         } else {
//             htmlElement.setAttribute('data-bs-theme', 'light');
//             localStorage.setItem('bsTheme', 'light');
//         }
//     });
// });


 /*style="background-color: hsl(20, 43%, 93%);*/