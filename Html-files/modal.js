document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const closeBtn = document.querySelector(".close-btn");

  // Handle form submission
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Here you can handle the form submission (e.g., send data to the server)

    // Display success message in modal
    modalMessage.textContent = "Your message has been sent successfully!";
    modalMessage.className = "success"; // Add success class for styling
    modal.style.display = "flex"; // Show modal

    // Clear the form fields
    contactForm.reset();
  });

  // Close the modal when the close button is clicked
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none"; // Hide modal
  });

  // Close the modal when clicking outside of the modal content
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none"; // Hide modal
    }
  });
});
