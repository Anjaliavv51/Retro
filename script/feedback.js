function submitFeedback(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form elements
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var comments = document.getElementById("comments").value.trim();
  var rating = document.querySelector('input[name="rating"]:checked');
  var issue = document.getElementById("issue").value;

  // Check if the feedback is empty
  if (comments === "") {
    // Show a SweetAlert error modal
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter your feedback before submitting.",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        content: "swal-content",
        confirmButton: "swal-confirm-button",
      },
    });
    return; // Exit the function if feedback is empty
  }

  // Check if a rating is selected
  if (!rating) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please select a rating before submitting.",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        content: "swal-content",
        confirmButton: "swal-confirm-button",
      },
    });
    return;
  }

  // Show a success message
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Your response has been recorded.",
    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      content: "swal-content",
      confirmButton: "swal-confirm-button",
    },
  }).then((result) => {
    // Clear the feedback form after the user acknowledges the success modal
    if (result.isConfirmed || result.isDismissed) {
      document.getElementById("feedback-form").reset();
    }
  });
}
