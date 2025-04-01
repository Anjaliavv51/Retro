const stars = document.querySelectorAll('#rating i');
    const submitButton = document.getElementById('submitFeedback');

    let selectedRating = 0;

    // Handle star rating click
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars(selectedRating);
      });
    });

    function updateStars(rating) {
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    }

    // Handle submit button click
    submitButton.addEventListener('click', () => {
      const feedbackType = document.getElementById('feedbackType').value;
      const comments = document.getElementById('comments').value;
      const fileUpload = document.getElementById('fileUpload').files[0];

      if (!feedbackType || !selectedRating || !comments) {
        alert('Please fill in all required fields.');
        return;
      }

      alert('Feedback submitted successfully!');
      console.log({
        feedbackType,
        selectedRating,
        comments,
        file: fileUpload ? fileUpload.name : 'No file uploaded'
      });
    });