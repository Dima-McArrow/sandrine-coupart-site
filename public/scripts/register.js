

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");

  // Fetch diet types and allergens to populate the form
  fetchDietTypesAndAllergens();

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      firstName: document.getElementById("first_name").value,
      lastName: document.getElementById("last_name").value,
      birthday: document.getElementById("birthday").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      dietTypes: Array.from(
        document.querySelectorAll('input[name="dietType"]:checked')
      ).map((el) => el.value),
      allergens: Array.from(
        document.querySelectorAll('input[name="allergen"]:checked')
      ).map((el) => el.value),
    };

    fetch(`${config.API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "/ok.html";
        } else {
          alert("Registration failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  function fetchDietTypesAndAllergens() {
    // Fetch diet types
    fetch(`${config.API_BASE_URL}/api/dietTypes`)
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementById("dietTypesContainer");
        data.forEach((diet) => {
          const checkbox = `<label><input type="checkbox" name="dietType" value="${diet.id}">${diet.name}</label>`;
          container.innerHTML += checkbox;
        });
      });

    // Fetch allergens
    fetch(`${config.API_BASE_URL}/api/allergens`)
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementById("allergensContainer");
        data.forEach((allergen) => {
          const checkbox = `<label><input type="checkbox" name="allergen" value="${allergen.id}">${allergen.name}</label>`;
          container.innerHTML += checkbox;
        });
      });
  }
});
