import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,query, where,Timestamp, increment,addDoc, collection,setDoc, getDoc,getDocs, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
let currentUser = auth.currentUser;



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







budgetForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
    const budgetCategory =  budgetForm.category.value
    const amount =  budgetForm.amount.value.trim()
    const budgetDescription = budgetForm.description.value
    const name = budgetForm.name.value
    const userRef = doc(colRef, currentUser.uid); 
    const budgetRef = collection(userRef, "budgetInfo"); 


    if (!budgetCategory || !amount || !budgetDescription) {
        alert("Please fill in all fields");
        return;
    }
    const budgetInfo = {
        budgetCategory,
        amount,
        budgetDescription,
        currentMonth,
        name
    };
    try {
        await addDoc(budgetRef, budgetInfo);
        Swal.fire({
          icon: 'success',    // Success icon
          title: 'Success!',  // Title
          text: 'Your Budget information has been added successfully.', // Message
          confirmButtonText: 'Okay'  // Button text
        });
        ExpenseModal.classList.add("hidden")
        budgetModal.classList.add("hidden");
    } catch (err) {
        console.log(err);
    }
});



// async function compareBudgetVsSpending() {
//   const now = new Date();
//   const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
//   try {
//     const summaryRef = collection(colRef, currentUser.uid, "summaryInfo");
//     const expensesSnapshot = await getDocs(summaryRef);
//     const budgetRef = collection(colRef, currentUser.uid, 'budgetInfo');
//     const budgetQuery = query(budgetRef, where("currentMonth", "==", currentMonth));
//     const budgetSnapshot = await getDocs(budgetQuery);

//     if (budgetSnapshot.empty) {
//       console.log("No budget set for this month.");
//       return;
//     }

//     const budget = {}
//     budgetSnapshot.forEach((doc) =>{
//       const data = doc.data();
//       budget[data.budgetCategory] = Number(data.amount)  || 0
//       console.log(budget)
//     })

//     const categoryTotals = {}
//     expensesSnapshot.forEach((expense) =>{
//       const actualExpense = expense.data();
//       if (actualExpense.type !== "expense") return;
//       const expenseMonth = actualExpense.date.toDate().toLocaleString('default', { month: 'short', year: 'numeric' });
//       if (expenseMonth !== currentMonth) return;
//       const category = actualExpense.category;
//       const amount = actualExpense.amount
//       categoryTotals[category] = (categoryTotals[category] || 0) + amount
//       console.log(categoryTotals);
//     })

//     for (let cat in budget){
//       const spent = categoryTotals[cat] || 0;
//       const limit = budget[cat] || 0;
//       const remaining = limit - spent;
//       console.log(remaining,limit,spent);
//     }
//     let totalBudget = 0;
//       let totalSpent = 0;
//       for (let cat in budget){
//         totalBudget += budget[cat];
//         totalSpent += categoryTotals[cat] || 0;
//         console.log(totalBudget,totalSpent);
        
//       }
//   } catch (err) {
//     console.log(err);
//   }
// }

async function compareBudgetVsSpending() {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
  
    try {
      const summaryRef = collection(colRef, currentUser.uid, "summaryInfo");
      const expensesSnapshot = await getDocs(summaryRef);
  
      const budgetRef = collection(colRef, currentUser.uid, 'budgetInfo');
      const budgetQuery = query(budgetRef, where("currentMonth", "==", currentMonth));
      const budgetSnapshot = await getDocs(budgetQuery);
  
      if (budgetSnapshot.empty) {
        console.log("No budget set for this month.");
        return;
      }
  
      // Extract budgets into a category:amount object
      const budget = {};
      budgetSnapshot.forEach(doc => {
        const data = doc.data();
        budget[data.budgetCategory] = Number(data.amount);
      });
      
  
      // Group expenses by category for this month
      const categoryTotals = {};
      if (expensesSnapshot.empty) {
        budgetProgress.innerHTML = `<p class="text-black-500 text-sm">No expenses or budget data to show for ${currentMonth}.</p>`;
        return;
        
      }
      expensesSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.type !== "expense") return;
  
        const expenseMonth = data.date.toDate().toLocaleString('default', { month: 'short', year: 'numeric' });
        if (expenseMonth === currentMonth) {
          const category = data.category;
          const amount = Number(data.amount) || 0;
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });
  
      const budgetProgress = document.getElementById('budgetProgress');
      budgetProgress.innerHTML = ''; // Clear previous
  
      for (let cat in budget) {
        const spent = categoryTotals[cat] || 0;
        const limit = budget[cat];
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const percentText = Math.floor(percent);
        let barColor = 'bg-green-500';
      
        if (percent >= 90) barColor = 'bg-red-500';
        else if (percent >= 70) barColor = 'bg-yellow-500';
        else if (percent >= 40) barColor = 'bg-blue-500';
      
        // Show alert if the limit is exceeded
        if (spent > limit) {
            const toast = document.getElementById('budgetToast');
            toast.textContent = `⚠️ Budget exceeded for ${cat}: $${spent.toLocaleString()} / $${limit.toLocaleString()}`;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 5000);
            
        }
      
        budgetProgress.innerHTML += `
          <div class="mb-4">
            <div class="flex justify-between text-sm font-medium mb-1">
              <span class="capitalize text-gray-700">${cat}</span>
              <span class="text-gray-600">$${spent.toLocaleString()} / $${limit.toLocaleString()} (${percentText}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div class="${barColor} h-full rounded-full transition-all duration-500 ease-in-out" style="width: ${percent}%"></div>
            </div>
          </div>
        `;

        // Totals
            let totalBudget = 0;
            let totalSpent = 0;

            for (let cat in budget) {
              totalBudget += budget[cat];
              totalSpent += categoryTotals[cat] || 0;
            }

            const totalRemaining = totalBudget - totalSpent;
            const percentSpent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
            const percentRemaining = 100 - percentSpent;

            // Display or use it however you like
            console.log("Total Budget: ₦" + totalBudget.toLocaleString());
            console.log("Total Spent: ₦" + totalSpent.toLocaleString());
            console.log("Remaining: ₦" + totalRemaining.toLocaleString());
            console.log("Percent Spent: " + Math.floor(percentSpent) + "%");
            console.log("Percent Remaining: " + Math.floor(percentRemaining) + "%");
            totalRemainingDisplay.textContent = `$${totalRemaining.toLocaleString()}` || `$0.00`
            totalSpentDisplay.textContent = `$${totalSpent.toLocaleString()}` || `$0.00`
            totalBudgetDisplay.textContent = `$${totalBudget.toLocaleString()}` || `$0.00`;
            spentRemaining.textContent = (Math.floor(percentSpent) + "%") || `0%`
            remainingDisp.textContent = (Math.floor(percentRemaining) + "%") || `0%`

      }
      
    } catch (error) {
      console.error("Error comparing budget vs spending:", error);
    }
  }
  
  
  


async function displayBudgetDetails() {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
  
    const budgetTable = document.getElementById('budgetContainer');
    budgetTable.innerHTML = ''; // Clear table body
  
    try {
      const userRef = doc(colRef, currentUser.uid);
      const budgetRef = collection(userRef, "budgetInfo");
      const budgetSnapshot = await getDocs(budgetRef);
  
      // Get expenses
      const summaryRef = collection(colRef, currentUser.uid, "summaryInfo");
      const expensesSnapshot = await getDocs(summaryRef);
  
      // Group expenses by category
      const categorySpent = {};
      expensesSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.type !== "expense") return;
  
        const expenseMonth = data.date.toDate().toLocaleString('default', { month: 'short', year: 'numeric' });
        if (expenseMonth !== currentMonth) return;
  
        const cat = data.category;
        const amt = Number(data.amount) || 0;
        categorySpent[cat] = (categorySpent[cat] || 0) + amt;
      });
  
      if (budgetSnapshot.empty) {
        // Display message if no budgets found

        budgetTable.innerHTML = '<tr><td colspan="6" class="p-3 text-center ">No budgets found.</td></tr>';
        return;
      }
      budgetSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const id = docSnap.id;
        const isActive = data.currentMonth === currentMonth;
        const statusColor = isActive ? 'text-green-500' : 'text-red-500';
        const statusText = isActive ? 'Active' : 'Expired';
  
        const cat = data.budgetCategory;
        const budgetAmount = Number(data.amount) || 0;
        const spent = categorySpent[cat] || 0;
        const percentUsed = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
        const percentText = Math.floor(percentUsed);
  
        budgetTable.innerHTML += `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${data.name || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${budgetAmount.toLocaleString()}</td>
            <td class="${statusColor} px-6 py-4 whitespace-nowrap text-sm text-gray-500">${statusText}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out" style="width: ${percentUsed}%;"></div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button onclick="editBudget('${id}')" class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
              <button onclick="deleteBudget('${id}')" class="text-red-600 hover:text-red-800">Delete</button>
            </td>
          </tr>
        `;
      });
  
    } catch (error) {
      console.error('Error loading budgets:', error);
      budgetTable.innerHTML = '<tr><td colspan="6" class="text-red-500 text-center py-4">Failed to load budgets.</td></tr>';
    }
  }
  displayBudgetDetails();
  
  





  document.addEventListener("click", async (e) =>{

    if (e.target.closest("#logOutBtn")) {
      e.preventDefault();
      await signOut(auth);
      console.log("User logged out");
      location.href = "../pages/login.html";
    }
  })


  document.getElementById('openBudgetModal').addEventListener('click', () => {
    document.getElementById('budgetModal').classList.remove('hidden');
  });
  document.getElementById('cancelBudget').addEventListener('click', () => {
    document.getElementById('budgetModal').classList.add('hidden');
  });


document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("toBeload").classList.add("hidden");
    document.getElementById("loadedContent").classList.remove("hidden");
  }, 1000);
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

onAuthStateChanged(auth, (user) =>{
  if (user) {
    console.log(user);
    currentUser = user
    
    
    displayAllUserProfile(currentUser);
    displayBudgetDetails(currentUser);
    compareBudgetVsSpending(currentUser);
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
})


