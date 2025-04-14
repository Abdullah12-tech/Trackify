// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification
  } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

  import { getFirestore, updateDoc,doc, collection } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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

const db = getFirestore(app);
let auth = getAuth();
//Collection Reference(s)
const userColRef = collection(db, "Users");

uploadDetailsForm.addEventListener("submit", uploadDetails);
async function uploadDetails(e) {
  e.preventDefault();
  spinner.classList.remove("d-none");
  const profilePhoto = document.getElementById("photoToUpload");
  const photoData = Alpine.$data(profilePhoto);
  const userDetails = {
    name: uploadDetailsForm.fullname.value.trim(),
    phone: uploadDetailsForm.phone.value.trim(),
    address: uploadDetailsForm.address.value.trim(),
    nation: uploadDetailsForm.nation.value.trim(),
    photo: photoData.photoPreview,
    zipcode: uploadDetailsForm.zipcode.value.trim(),
  };

  console.log(userDetails);
  
  try {
    const currentUser = auth.currentUser
    if (!currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
    }
    let docRef = await doc(userColRef, currentUser.uid);
    let docSnap = await updateDoc(docRef, userDetails);
    console.log(docSnap);
    location.href = "../pages/login.html"
    alert("User Information successfully added");
    spinner.classList.add("d-none");
  } catch (err) {
    console.log(err);
    
    
  }
  finally{
    spinner.classList.add("d-none");
  }
}

onAuthStateChanged(auth, (user) =>{
    if (user) {
        console.log(user);
    }else{
        console.log("User not signed in");
        location.href = "../pages/login.html"
    }
})
