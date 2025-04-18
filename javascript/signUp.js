import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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
//Initialize Firestore
const db = getFirestore(app);
//Collection Reference(s)
const userColRef = collection(db, "Users");

signUpForm.addEventListener("submit", createUserAccount);

async function createUserAccount(e) {
  e.preventDefault();
    const userDetails = {
      name: signUpForm.fullName.value.trim(),
      email: signUpForm.email.value.trim(),
      password: signUpForm.password.value.trim(),
      confirmPassword: signUpForm.confirmPassword.value.trim(),
      username: signUpForm.username.value.trim(),
    };
    
  try {   
    spinner.classList.remove("d-none");
    errorP.textContent = "";
    signUpBtn.disabled = true;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (signUpForm.name.value === "" 
    || signUpForm.email.value === "" 
    || signUpForm.password.value === "" 
    || signUpForm.confirmPassword.value === ""
   || signUpForm.username.value === "") {
      throw new Error("Ensure all fields are filled");
      return;
    }
    if (!emailRegex.test(userDetails.email)) {
      throw new Error("*Invalid Email address");
      return;
    }
    if (userDetails.password.length < 6) {
      throw new Error("Password should be at least 6 characters");
      return;
    }
    if (userDetails.password !== userDetails.confirmPassword) {
      throw new Error("Password does not match");
      return
    } 
    const { password, confirmPassword, ...details } = userDetails;
    const res = await createUserWithEmailAndPassword(
      auth,
      details.email,
      password
    );
    console.log(res);
    const docRef = doc(userColRef, res.user.uid);
    const docRes = await setDoc(docRef, details);
    console.log(docRes);
    
    Swal.fire({
      icon: 'success',    // Success icon
      title: 'Success!',  // Title
      text: 'You have successfully signed Up.', // Message
      confirmButtonText: 'Okay'  // Button text
    }).then((result)=>{
      if (result.isConfirmed) {
        location.href = "../pages/details.html";

      }
    })
   
  } catch (error) {
    if (error.message === "Firebase: Error (auth/email-already-in-use).") {
      errorP.textContent = "Email already exists";
      return;
    }
    if (error.message === "Firebase: Error (auth/network-request-failed).") {
        errorP.textContent = "Please check your internet connection and try again"
        return
    }
    errorP.textContent = error.message;
    console.log(error);
    errorP.style.color = "red";
    
    // alert(error.message);
  } finally {
    spinner.classList.add("d-none");
    signUpBtn.disabled = false
  }
}