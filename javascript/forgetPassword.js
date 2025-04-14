import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnLhDWY1_s81cjcItSYT3H2vZBvxOdSBw",
  authDomain: "expense-tracker-461b8.firebaseapp.com",
  projectId: "expense-tracker-461b8",
  storageBucket: "expense-tracker-461b8.firebasestorage.app",
  messagingSenderId: "279356757639",
  appId: "1:279356757639:web:e441f2ca57381fbb870a22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Get DOM elements
const forgotPasswordForm = document.getElementById('forgotPasswordForm'); // Make sure your form has this ID
const verifyPass = document.getElementById('verifyPass'); // Element to show success message
const errorP = document.getElementById('errorP'); // Element to show error messages

forgotPasswordForm.addEventListener("submit", sendResetEmail);

async function sendResetEmail(e) {
  e.preventDefault();
  const email = forgotPasswordForm.email.value.trim();
  errorP.textContent = ""; // Clear previous errors
  verifyPass.textContent = ""; // Clear previous success messages

  try {
    if (!email) throw new Error("Please enter your email address.");

    // Check if email exists in Firebase Auth
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      throw new Error("No account found with this email."); // Custom error
    }

    // If email exists, send reset link
    await sendPasswordResetEmail(auth, email);
    verifyPass.textContent = `Password reset email sent to ${email}. Check your inbox.`;
  } catch (error) {
    console.error(error);
    errorP.textContent = error.message; // Display error to user
  }
}