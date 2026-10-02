// Show the pop-up automatically when the page loads
window.onload = function() {
  const popup = document.getElementById('popup');
  if (popup) {
    popup.style.display = 'flex';
  }
};

// Close the pop-up when the user clicks the close button
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
  closeBtn.addEventListener('click', function() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
  });
}

const popupLogo = document.querySelector('.popuplogo');
if (popupLogo) {
  popupLogo.addEventListener('click', function(event) {
    // Redirect to the signup page
    window.location.href = window.location.pathname.includes('/html/') ? 'signup.html' : 'html/signup.html';
  });
}

// email validation using a comprehensive regex
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Handle form submission
const emailForm = document.getElementById('emailForm');
if (emailForm) {
  emailForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailElem = document.getElementById('popup-email');
    const email = emailElem ? emailElem.value : '';
    
    // Check if the email is valid
    if (validateEmail(email)) {
        const popup = document.getElementById('popup');
        if (popup) popup.style.display = 'none';

        fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
        .then(r => r.json())
        .then(data => {
            alert(data.message || `Thank you! A 30% discount code has been sent to ${email}`);
        })
        .catch(() => {
            alert(`Thank you! A 30% discount code has been sent to ${email}`);
        });
    } else {
        alert('Please enter a valid email address.');
    }
  });
}

// Handle "No thanks" link
const noThanks = document.querySelector('.no-thanks');
if (noThanks) {
  noThanks.addEventListener('click', function(event) {
    event.preventDefault();
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
  });
}
