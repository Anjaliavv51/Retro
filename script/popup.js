    // Show the pop-up automatically when the page loads
    window.onload = function() {
        document.getElementById('popup').style.display = 'flex';
      };
  
      // Close the pop-up when the user clicks the close button
      document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('popup').style.display = 'none';
      });
  
      // Handle form submission
      document.getElementById('emailForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        if (email) {
          alert(`Thank you! A 30% discount code has been sent to ${email}`);
          document.getElementById('popup').style.display = 'none';
        }
      });
  
      // Handle "No thanks" link
      document.querySelector('.no-thanks').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('popup').style.display = 'none';
      });