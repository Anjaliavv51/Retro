// Show the pop-up automatically when the page loads
window.onload = function() {
  document.getElementById('popup').style.display = 'flex';
};

// Close the pop-up when the user clicks the close button
document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('popup').style.display = 'none';
});

document.querySelector('.popuplogo').addEventListener('click', function(event) {
  // Redirect to the login page
  window.location.href = 'Html-files/signup.html';  // Change to your actual login page URL
});

//email validation using a more comprehensive regex
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Handle form submission
document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = document.getElementById('popup-email').value;
  
  // Check if the email is valid
  if (validateEmail(email)) {
      // Hide the pop-up first, then show the alert after 0.1 seconds
      document.getElementById('popup').style.display = 'none';  // Close the pop-up

      setTimeout(function() {
          alert(`Thank you! A 30% discount code has been sent to ${email}`);
      }, 100);  // Delay of 100ms (0.1 seconds)
  } else {
      alert('Please enter a valid email address.');
  }
});

// Handle "No thanks" link
document.querySelector('.no-thanks').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('popup').style.display = 'none';
});
