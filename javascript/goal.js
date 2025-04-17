import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,onSnapshot,query,deleteDoc,orderBy,updateDoc, Timestamp, increment,addDoc, collection,setDoc, getDoc,getDocs, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
// let trackDetails;
let currentUser;

const goalForm = document.getElementById("goalForm");
const goalModal = document.getElementById("goalModal");

goalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const goalName = goalForm.goalName.value.trim()
  const targetAmount = goalForm.targetAmount.value.trim()
  const deadline = goalForm.deadline.value
  const priority = goalForm.priority.value
  const notes = goalForm.notes.value.trim()

  const goalData = {
    goalName ,
    targetAmount: targetAmount || 0,
    savedAmount: 0,
    deadline,
    priority,
    notes,
    status: "active",
    createdAt: new Date()
  };

  try {
    const userRef = doc(colRef, currentUser.uid);
    const goalsRef = collection(userRef, "goalsInfo");
    await addDoc(goalsRef, goalData);
    Swal.fire({
      icon: 'success',
      title: 'Form Submitted!',
      text: 'Your Goal has been added successfully.',
      confirmButtonText: 'Okay'
    });
    goalModal.classList.add("hidden");
    goalForm.reset();
    // fetchGoals(); // To refresh UI
  } catch (error) {
    console.error("Error adding goal:", error);
  }
});



async function displayAllUserProfile() {
    try {
        const docRef = doc(colRef, currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        const actualData = docSnap.data();

        username.textContent = actualData.username;
        username2.textContent = actualData.username;
        profileImg.src = actualData.photo;
        profileImg2.src = actualData.photo;
        

        
    } catch (err) {
        console.log(err);
    }
}




  document.addEventListener("click", async (e) =>{

    if (e.target.closest("#logOutBtn")) {
      e.preventDefault();
      await signOut(auth);
      console.log("User logged out");
      location.href = "../pages/login.html";
    }
  })

  


  const progressContainer = document.getElementById("goalProgress");
  const tableBody = document.getElementById("goalsTableBody");
  const activeEl = document.getElementById("activeEl");
  const completedEl = document.getElementById("completedEl");
  const totalSavedEl = document.getElementById("totalSavedEl");
function fetchAndRenderGoals(currentUser) {
  const goalsCol = collection(db,"Users", currentUser.uid, "goalsInfo");
  const q = query(goalsCol, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    let activeCount = 0;
    let completedCount = 0;
    let totalSaved = 0;

    progressContainer.innerHTML = '';
    tableBody.innerHTML = '';
    if (snapshot.empty) {
      progressContainer.innerHTML = `
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <tr>
            <td colspan="6" class="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">No data here yet</td>
            
          </tr>
        </div>
      `;
      tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">No data here yet</td>
            
          </tr>
        `;
      return;
    }

    snapshot.forEach((docSnapshot) => {
      const goal = docSnapshot.data();
      const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
      totalSaved += goal.savedAmount;

      // Check for completed
      if (goal.savedAmount >= goal.targetAmount && goal.status !== "completed") {
        updateDoc(doc(db,"Users", currentUser.uid, "goalsInfo", docSnapshot.id), {
          status: "completed"
        });
      }

      // Check for expired
      const today = new Date();
      const deadlineDate = new Date(goal.deadline);
      if (goal.status === "active" && deadlineDate < today && goal.savedAmount < goal.targetAmount) {
        updateDoc(doc(db,"Users", currentUser.uid, "goalsInfo", docSnapshot.id), {
          status: "expired"
        });
        return;
      }
      

      if (goal.status === "active") activeCount++;
      if (goal.status === "completed") completedCount++;

      const card = document.createElement("div");
      card.className = "bg-white p-5 rounded-lg shadow-sm border border-gray-100";
      card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-gray-800">${goal.goalName}</h3>
          <span class="bg-${goal.status === "completed" ? 'green' : goal.status === "expired" ? 'red' : 'blue'}-100 text-${goal.status === "completed" ? 'green' : goal.status === "expired" ? 'red' : 'blue'}-800 text-xs px-2 py-1 rounded-full">
            ${goal.status === "completed" ? 'Completed!' : goal.status === "expired" ? 'Expired' : 'Active'}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-3">${goal.notes || 'No description provided'}</p>
        <div class="mb-2">
          <div class="flex justify-between text-sm mb-1">
            <span>Saved: $${goal.savedAmount}</span>
            <span>${percent}% ${goal.status === "completed" ? '🎉' : ''}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-${goal.status === "completed" ? 'green' : goal.status === "expired" ? 'red' : 'blue'}-600 h-2 rounded-full" style="width: ${percent}%"></div>
          </div>
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>${goal.status === "completed" ? 'Completed' : goal.status === "expired" ? 'Expired on' : 'Deadline'}: ${goal.deadline}</span>
          ${goal.status === "completed" ? '<button onclick="celebrateGoal("${goal.goalName}")" class="text-blue-600 hover:underline">Celebrate!</button>' : ''}
        </div>
      `;
      progressContainer.appendChild(card);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${goal.goalName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${goal.targetAmount}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${goal.savedAmount}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${goal.deadline}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="bg-${percent === 100 ? 'green' : goal.status === "expired" ? 'red' : 'yellow'}-100 text-${percent === 100 ? 'green' : goal.status === "expired" ? 'red' : 'yellow'}-800 px-2 py-1 rounded-full text-xs">${percent}%</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="addFundsPrompt('${docSnapshot.id}', ${goal.savedAmount})">Add Funds</button>
          <button class="text-red-600 hover:text-red-800" id="${docSnapshot.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    activeEl.textContent = activeCount;
    completedEl.textContent = completedCount;
    totalSavedEl.textContent = `$${totalSaved}`;
  });
}

tableBody.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const goalId = e.target.id;
    if (e.target.textContent === "Delete") {
      deleteDoc(doc(db,"Users", currentUser.uid, "goalsInfo", goalId));
      e.target.closest("tr").remove();
    }
  }
});
window.addFundsPrompt = async function addFundsPrompt(goalId, currentSaved) {
  const amountStr = prompt("Enter amount to add:");
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return alert("Please enter a valid number");

  const currentUser = auth.currentUser;
  const goalRef = doc(db,"Users", currentUser.uid, "goalsInfo", goalId);
  await updateDoc(goalRef, {
    savedAmount: currentSaved + amount
  });
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
  alert("Funds added successfully!");
}


window.celebrateGoal = async function celebrateGoal(goalName) {
  
  alert(`🎉 Congrats! You completed "${goalName}"!`);
};


  
  
  



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

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("toBeload").classList.add("hidden");
    document.getElementById("loadedContent").classList.remove("hidden");
  }, 1000);
});
// Helper function to get week number
// function getWeekNumber(date) {
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
//   const week1 = new Date(d.getFullYear(), 0, 4);
//   return {
//     week: 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7),
//     year: d.getFullYear()
//   };
// }

// Add event listener for filter changes

document.getElementById('openGoalModal').addEventListener('click', () => {
    document.getElementById('goalModal').classList.remove('hidden');
  });
  document.getElementById('cancelGoal').addEventListener('click', () => {
    document.getElementById('goalModal').classList.add('hidden');
  });



onAuthStateChanged(auth, (user) =>{
    if (user) {
        console.log(user);
        currentUser = user
        displayAllUserProfile(user);
        fetchAndRenderGoals(currentUser);
        // displayTrackedProfile(user);
        // displayMainInfo(user)
        // loadCategoryChart();
        // document.addEventListener('DOMContentLoaded', loadCategoryChart);
        // document.getElementById('summaryFilter')?.addEventListener('change', loadFinancialSummary);
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
});