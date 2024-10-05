document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById('nameError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('messageError').innerText = '';
    document.getElementById('successMessage').innerText = '';

    // Form validation
    let isValid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '') {
        document.getElementById('nameError').innerText = 'Please enter your name.';
        isValid = false;
    }

    if (email === '' || !validateEmail(email)) {
        document.getElementById('emailError').innerText = 'Please enter a valid email address.';
        isValid = false;
    }

    if (message === '') {
        document.getElementById('messageError').innerText = 'Please enter your message.';
        isValid = false;
    }

    if (isValid) {
        document.getElementById('successMessage').innerText = 'Thank you for contacting us! We will get back to you soon.';
        document.getElementById('contactForm').reset();
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
}
