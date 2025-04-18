import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,
    collection, getDoc,updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
const colRef = collection(db, "Users");
const auth = getAuth();



async function displayAllUserProfile() {
    const currentUser = auth.currentUser;
    try {
        const docRef = doc(colRef, currentUser.uid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        const actualData = docSnap.data();
        // console.log(actualData);
        profileImg.src = `${actualData.photo}`;
        profileImg2.src = `${actualData.photo}`;
        username.textContent = actualData.username
        userPhoto.src = `${actualData.photo}`
        uploadDetailsForm.fullName.value = actualData.name
        uploadDetailsForm.phone.value = actualData.phone
        uploadDetailsForm.address.value = actualData.address
        uploadDetailsForm.nation.value = actualData.nation
        uploadDetailsForm.zipcode.value = actualData.zipcode
        // uploadDetailsForm.fullName.disabled = true;
        // uploadDetailsForm.phone.disabled = true;
        // uploadDetailsForm.zipcode.disabled = true;
        // uploadDetailsForm.nation.disabled = true;
        // uploadDetailsForm.address.disabled = true;
        // uploadDetailsForm.photo.disabled = true;
        // saveBtn.disabled = true;
    } catch (err) {
        console.log(err);
    }
}


editBtn.addEventListener("click", editUserDetails);
async function editUserDetails(e) {
    e.preventDefault();
    // uploadDetailsForm.fullName.disabled = false;
    // uploadDetailsForm.phone.disabled = false;
    // uploadDetailsForm.zipcode.disabled = false;
    // uploadDetailsForm.nation.disabled = false;
    // uploadDetailsForm.address.disabled = false;
    // uploadDetailsForm.photo.disabled = false;
    // saveBtn.disabled = false;
    // editBtn.disabled = true

}
const fileInput = document.getElementById('photoToUpload');
  const selectBtn = document.getElementById('selectPhotoBtn');
  const profileImg = document.getElementById('profileImg');
  let result = null;

  selectBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      result = e.target.result;
      profileImg.src = result;
      profileImg.style.display = 'block';
    };

    reader.readAsDataURL(file);
  });

  window.onload = function () {
    setTimeout(function() {
      document.getElementById("toBeload").classList.add("hidden");
      document.getElementById("loadedContent").classList.remove("hidden");
    }, 1000);
  }
document.addEventListener("click", async (e) =>{
    if (e.target.closest("#saveBtn")) {
        e.preventDefault();
        const currentUser = auth.currentUser;

        const userDetails = {
            name: uploadDetailsForm.fullName.value.trim(),
            phone: uploadDetailsForm.phone.value.trim(),
            address: uploadDetailsForm.address.value.trim(),
            nation: uploadDetailsForm.nation.value.trim(),
            zipcode: uploadDetailsForm.zipcode.value.trim(),
            photo: result
        }

        try {
            let docRef = await doc(colRef, currentUser.uid);
            await updateDoc(docRef, userDetails);

            // alert("User Information updated successfully");
            // window.location.reload()
            Swal.fire({
            icon: 'success',    // Success icon
            title: 'Success!',  // Title
            text: 'Your information has been updated successfully.', // Message
            confirmButtonText: 'Okay'  // Button text
            }).then((result)=>{
              if (result.isConfirmed) {
                window.location.href = "../pages/dashboard.html";
                
              }
            })
            displayAllUserProfile();

        } catch (err) {
            console.log(err);
            if (err.message === "FirebaseError: Request payload size exceeds the limit: 11534336 bytes.") {
                alert("File size exceeds the limit of 10MB. Please choose a smaller file.");
            } else {
                alert("An error occurred while updating user information.");
                
            }
        }
    }
})

passwordForm.addEventListener("submit", changePassword);
async function changePassword(e) {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.log("No any user logged in");
    }
    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        alert("Please fill in all fields!");
        return;
    }

    if (newPassword.value.length < 6) {
        alert("Password must be at least six characters")
    }

    if (newPassword.value !== confirmPassword.value) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Please check your password and try again.',
        confirmButtonText: 'Try Again'
      });
        return
    }

    const credential = EmailAuthProvider.credential(currentUser.email, oldPassword.value);
    
    try {
        await reauthenticateWithCredential(currentUser, credential);

        await updatePassword(currentUser, newPassword.value);
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Password changed successfully',
          confirmButtonText: 'success'
        }).then((result)=>{
          if (result.isConfirmed) {
            location.href = "../pages/dashboard.html";

          }
        })
        
    } catch (err) {
        console.log(err);
        if (err.message = "Firebase: Error (auth/invalid-credential).") {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect Password',
            text: 'Please check your password and try again.',
            confirmButtonText: 'Try Again'
          });
        }
    }
}


document.addEventListener("click", async (e) =>{
    if (e.target.closest("#logOutBtn")) {
        e.preventDefault();
        await signOut(auth)
        console.log(e.target);
        location.href = "../pages/login.html"
    }
});



const switchToggle = document.getElementById("theme-toggle");
let isDarkmode = localStorage.getItem("isDarkmode") === "true";

const darkIcon = `<svg id="sun-icon" width="24" height="24" class="fill-current text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l.7-.7M6.34 17.66l.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>`;

const lightIcon = `<svg id="moon-icon" width="24" height="24" class="fill-current text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;

function toggleTheme() {
  isDarkmode = !isDarkmode;
  localStorage.setItem("isDarkmode", isDarkmode);
  document.documentElement.classList.toggle("dark");
  switchTheme();
  // loadCategoryChart();
  // loadFinancialSummary();
}

function switchTheme() {
  if (isDarkmode) {
    document.documentElement.classList.add("dark");
    switchToggle.classList.remove("bg-white");
    switchToggle.classList.add("bg-gray-700");

    setTimeout(() => {
      switchToggle.innerHTML = darkIcon;
    }, 250);
  } else {
    document.documentElement.classList.remove("dark");
    switchToggle.classList.remove("bg-gray-700");
    switchToggle.classList.add("bg-white");

    setTimeout(() => {
      switchToggle.innerHTML = lightIcon;
    }, 250);
  }
}

// On load, apply theme based on localStorage
if (isDarkmode) {
  document.documentElement.classList.add("dark");
}
switchTheme();
 switchToggle.addEventListener("click", toggleTheme);
onAuthStateChanged(auth, async (user) =>{
    if (user) {
        console.log(user);
        displayAllUserProfile();
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
})