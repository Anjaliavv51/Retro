document.addEventListener("DOMContentLoaded", () => {
  const contributorsContainer = document.getElementById("contributors");

  async function fetchContributors() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/Anjaliavv51/Retro/contributors`
      );
      const contributors = await response.json();

      contributorsContainer.innerHTML = "";
      contributors.forEach((contributor) => {
        const contributorCard = document.createElement("div");
        contributorCard.className = "contributor-card";

        contributorCard.innerHTML = `
            <a href="${contributor.html_url}" target="_blank" rel="noopener noreferrer">
              <img src="${contributor.avatar_url}" alt="${contributor.login}">
            </a>
            <h2>${contributor.login}</h2>
            <p>Contributions: ${contributor.contributions}</p>
          `;

        contributorsContainer.appendChild(contributorCard);
      });
    } catch (error) {
      console.error("Error fetching contributors:", error);
    }
  }

  fetchContributors();
});

// Dark mode (remains unchanged)
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("themeToggle");
  const body = document.body;

  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggleCheckbox.checked = true;
  } else {
    toggleCheckbox.checked = false;
  }

  toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }
  });
});
