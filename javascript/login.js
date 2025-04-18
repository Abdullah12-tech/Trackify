import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

signInForm.addEventListener('submit', logInUser);
signInForm.email.value === "";
signInForm.password.value === "";
async function logInUser(e) {
    e.preventDefault();
    
    if (!signInForm.email.value || !signInForm.password.value) {
        errorP.textContent = "Please fill in all fields"
        return
    }
    
    const userDetails = {
        email: signInForm.email.value.trim(),
        password: signInForm.password.value.trim(),
    }
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    errorP.textContent = "";
    try {
        const userCredential = await signInWithEmailAndPassword(auth, userDetails.email, userDetails.password);
        const user = userCredential.user;
        if(!user.emailVerified){
            verify.style.fontSize = "1rem"
            verify.textContent = `We have sent a verification email to ${user.email}. Please verify your email address before you log in.`
            return
        }
        console.log(user);
        Swal.fire({
            icon: 'success',    // Success icon
            title: 'Success!',  // Title
            text: 'Logged in Successfully', // Message
            confirmButtonText: 'Okay'  // Button text
          }).then((result)=>{
            if (result.isConfirmed) {
                location.href = "../pages/dashboard.html"
                
            }
          })
        errorP.textContent = ""
        verify.textContent = ""
    } catch (error) {
        console.log(error.message);
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
            errorP.textContent = "Invalid email or password."  
        }
        if (error.message === "Firebase: Error (auth/network-request-failed).") {
            errorP.textContent = "Please check your network connection and try again"
            return  
        }
    }finally {
        spinner.classList.add("hidden");
        submitBtn.disabled = false;
    }
}

onAuthStateChanged(auth, (user)=>{
    if (user) {
        if (user.emailVerified) {
            console.log(user);
            const messageShown = localStorage.getItem('emailVerifiedMessageShown');

            if (!messageShown) {
              // Check if the user is the first user (optional: you could track this via Firebase Firestore or localStorage)
              const isFirstUser = localStorage.getItem('firstUser');
            
              if (!isFirstUser) {
                // Display the message for the first user

                verify.textContent = "Your email is verified, You can now log in";
                verify.style.color = "green"
                // Mark the message as shown for this session
                localStorage.setItem('emailVerifiedMessageShown', 'true');

                // Optionally, mark this user as the first user (for future logins)
                localStorage.setItem('firstUser', 'true'); // This ensures the message is shown only to the first user
              }
            }
        }else{
            verify.style.fontSize = "1rem"
            verify.textContent = `We have sent a verification email to ${user.email}. Please verify your email address before you log in.`
        }
    }else{
        console.log("User not yet signed in");
    }
})
