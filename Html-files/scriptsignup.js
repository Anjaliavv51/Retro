import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx_FcoL3XJryt6BInhOaDsMKiSmxzrYBI",
  authDomain: "fir-7f3dd.firebaseapp.com",
  projectId: "fir-7f3dd",
  storageBucket: "fir-7f3dd.appspot.com",
  messagingSenderId: "467011865433",
  appId: "1:467011865433:web:e23be9d0cc3496bb961a48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const provider = new GoogleAuthProvider();

document.getElementById("google-login").addEventListener("click", function() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "signed.html";
    }).catch((error) => {
      console.error("Error during Google sign-in:", error);
    });
});

document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();  // Prevent form from submitting the default way
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const nameError = document.getElementById("name-error");
  const passwordError = document.getElementById("password-error");
  const emailError = document.getElementById("email-error");

  // Reset error messages
  nameError.textContent = "";
  passwordError.textContent = "";
  emailError.textContent = "";

  // Regex to prevent <, >, ", or / in the name and password
  const spcharexp = /[<>"/]/;

  let valid = true; // A flag to track validation status

  // Name validation
  if (spcharexp.test(name)) {
      nameError.textContent = "Name cannot contain <, >, \", or /";
      valid = false;
  }

  // Password validation
  if (spcharexp.test(password)) {
      passwordError.textContent = "Password cannot contain <, >, \", or /";
      valid = false;
  }

  if (validateForm(name, email, password) && valid) {
    // Simulate a successful registration (Replace with actual Firebase sign-up logic)
    console.log("Form submitted with:", { name, email, password });
    window.location.href = "../Html-files/signed.html";
  }
});

function validateForm(name, email, password) {
  if (name === "" || email === "" || password === "") {
    alert("All fields are required!");
    return false;
  }
  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return false;
  }
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}