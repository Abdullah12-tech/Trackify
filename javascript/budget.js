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







// let updateInfo;
// let summaryInfo;

// infoBody.addEventListener("click", async (e) => {
//   console.log(e.target.nodeName);
  
//   const userTrackRef = doc(colRef, currentUser.uid)
//   // const mainRef = collection(userTrackRef, "main-info");
//   const summaryRef = collection(userTrackRef, "summaryInfo")
//   // const id = `user-${currentUser.uid}`;
//   // const docRef = doc(mainRef, id);
//   // const trackDetailsRef = collection(userTrackRef, "financialInfo")
//     let amount = document.getElementById("amountInp")
//     // updateInfo = {
//     //     Balance: parseFloat((totalInp).textContent),
//     //     Income: parseFloat((incomeInp).textContent),
//     //     Expense: parseFloat((expenseInp).textContent),
//     //     // Budget: parseFloat((budgetInp).textContent)
//     // }
//     summaryInfo = {
//         type: "income",
//         amount:  0,
//         date: Timestamp.now()
//     }
//     // trackDetails = {
//     //     date: new Date().toLocaleDateString()
//     // }
//     if (e.target.closest("#addIncome")) {
//       incomeShow.innerHTML = incomeFormHTML;
//       expenseShow.innerHTML = "";
//       budgetShow.innerHTML = "";
//     }

//     if (e.target.closest("#submitIncome")) {
//         e.preventDefault();
//         if (incomeCategory.value === "" 
//             || incomeDescription.value === "" || amount.value === "") {
//             alert("Ensure all fields are filled")
//             return
//         }
//         const enteredIncomeAmount = parseFloat(amount.value.trim());
//         // updateInfo.Balance += enteredIncomeAmount;
//         // updateInfo.Income += enteredIncomeAmount;
//         summaryInfo.type = "income"
//         summaryInfo.description = incomeDescription.value
//         summaryInfo.amount = enteredIncomeAmount
//         summaryInfo.category = incomeCategory.value
//         // incomeInp.textContent = `${updateInfo.Income}`
//         // totalInp.textContent = `${updateInfo.Balance}`
//         // trackDetails.description = incomeDescription.value
//         // trackDetails.amount = +amount.value.trim()
//         // trackDetails.category = incomeCategory.value
//         // trackDetails.name = "income"
//         // console.log(trackDetails);
//         // console.log(updateInfo);
        
//         try {
//             await addDoc(summaryRef, summaryInfo)
//             // await addDoc(trackDetailsRef, trackDetails);
//             // await setDoc(docRef, updateInfo)
//             alert("Income information added successfully")
//             window.location.reload();
//         } catch (err) {
//             console.log(err);
//         }
//         // // Add your submit logic here
//     }


  
//     if (e.target.closest("#addExpense")) {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth"
//         });
        
//         expenseShow.innerHTML = expenseFormHTML;
//         incomeShow.innerHTML = "";
//         budgetShow.innerHTML = "";
        
//     }
//     if (e.target.closest("#submitExpense")) {
//         e.preventDefault();
//         if (expenseCategory.value === "" 
//             || expenseDescription.value === "" || amount.value === "") {
//             alert("Ensure all fields are filled")
//             return
//         }
//         const enteredIncomeAmount = parseFloat(amount.value.trim());
//         // updateInfo.Balance -= enteredIncomeAmount;
//         // updateInfo.Expense += enteredIncomeAmount;
//         summaryInfo.type = "expense"
//         summaryInfo.description = expenseDescription.value
//         summaryInfo.amount = enteredIncomeAmount
//         summaryInfo.category = expenseCategory.value
//         // expenseInp.textContent = `${updateInfo.Expense}` 
//         // totalInp.textContent = `${updateInfo.Balance}`
//         // trackDetails.description = expenseDescription.value
//         // trackDetails.amount = +amount.value.trim()
//         // trackDetails.category = expenseCategory.value
//         // trackDetails.name = "expense"
//         // console.log(trackDetails);
//         try {
//           await addDoc(summaryRef, summaryInfo)
//           // await addDoc(trackDetailsRef, trackDetails);
//           // await setDoc(docRef, updateInfo)
//           alert("Expense information added successfully")
//           window.location.reload();
//         } catch (err) {
//           console.log(err);
          
//         }
        
//         // Add your submit logic here
//       }
  
  
  
//   });
  


budgetForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
    const budgetCategory =  budgetForm.category.value
    const amount =  budgetForm.amount.value.trim()
    const budgetDescription = budgetForm.description.value
    const name = budgetForm.name.value
     // this is CollectionReference
    const userRef = doc(colRef, currentUser.uid); // this is DocumentReference
    const budgetRef = collection(userRef, "budgetInfo"); // subcollection reference


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
        alert("Budget information added successfully");
        budgetModal.classList.add("hidden");
    } catch (err) {
        console.log(err);
    }
});




  
// async function compareBudgetVsSpending() {
//     const now = new Date();
//     const currentMonth = now.toLocaleString('default', { month: 'short', year: 'numeric' });
  
//     const userRef = doc(colRef, currentUser.uid); // Make sure `colRef` points to your users collection
//     const expensesRef = collection(userRef, "summaryInfo");
//     const budgetRef = doc(collection(userRef, "budgetInfo"), currentMonth);
  
//     try {
//       const [expensesSnapshot, budgetDoc] = await Promise.all([
//         getDocs(expensesRef),
//         getDoc(budgetRef)
//       ]);
  
//       const budgetProgress = document.getElementById('budgetProgress');
//       budgetProgress.innerHTML = '';
  
//       if (!budgetDoc.exists()) {
//         budgetProgress.innerHTML = `<p class="text-gray-500 text-sm">No budget set for ${currentMonth}.</p>`;
//         return;
//       }
  
//       const budget = budgetDoc.data();
//       const categoryTotals = {};
  
//       expensesSnapshot.forEach(doc => {
//         const data = doc.data();
//         if (data.type !== 'expense') return;
  
//         const date = data.date?.toDate?.();
//         const expenseMonth = date?.toLocaleString?.('default', { month: 'short', year: 'numeric' });
//         if (expenseMonth === currentMonth) {
//           const category = data.category || 'Uncategorized';
//           const amount = Number(data.amount) || 0;
//           categoryTotals[category] = (categoryTotals[category] || 0) + amount;
//         }
//       });
  
//       let hasData = false;
  
//       for (let cat in budget) {
//         const limit = Number(budget[cat]) || 0;
//         const spent = Number(categoryTotals[cat]) || 0;
  
//         if (limit === 0) continue; // Avoid division by 0
  
//         hasData = true;
  
//         const percent = Math.min((spent / limit) * 100, 100);
//         const percentText = Math.floor(percent);
  
//         let barColor = 'bg-green-500';
//         if (percent >= 90) barColor = 'bg-red-500';
//         else if (percent >= 70) barColor = 'bg-yellow-500';
//         else if (percent >= 40) barColor = 'bg-blue-500';
  
//         budgetProgress.innerHTML += `
//           <div class="mb-4">
//             <div class="flex justify-between text-sm font-medium mb-1">
//               <span class="capitalize text-gray-700">${cat}</span>
//               <span class="text-gray-600">₦${spent.toLocaleString()} / ₦${limit.toLocaleString()} (${percentText}%)</span>
//             </div>
//             <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//               <div class="${barColor} h-full rounded-full transition-all duration-500 ease-in-out" style="width: ${percent}%"></div>
//             </div>
//           </div>
//         `;
//       }
  
//       if (!hasData) {
//         budgetProgress.innerHTML = `<p class="text-gray-500 text-sm">No expenses or budget data to show for ${currentMonth}.</p>`;
//       }
  
//     } catch (error) {
//       console.error("Error comparing budget vs spending:", error);
//       document.getElementById('budgetProgress').innerHTML = `
//         <p class="text-red-500 text-sm">Failed to load budget comparison. Please try again.</p>
//       `;
//     }
//   }


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
  
      // Display budgets
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

// async function displayMainInfo(currentUser) {
//   const userTrackRef = doc(colRef, currentUser.uid);
//   const summaryRef = collection(userTrackRef, "summaryInfo");

//   try {
//     const summarySnap = await getDocs(summaryRef);

//     let totals = { income: 0, expense: 0, balance: 0 };

//     summarySnap.forEach(doc => {
//       const data = doc.data();
//       const amount = Number(data.amount || 0);
//       const type = data.type;

//       if (type === 'income') {
//         totals.income += amount;
//       } else if (type === 'expense') {
//         totals.expense += amount;
//       }
//     });

//     totals.balance = totals.income - totals.expense;

//     document.getElementById('totalIncome').textContent = `$${totals.income.toLocaleString()}`;
//     document.getElementById('totalExpense').textContent = `$${totals.expense.toLocaleString()}`;
//     document.getElementById('totalBalance').textContent = `$${totals.balance.toLocaleString()}`;

//   } catch (err) {
//     console.error("Error displaying main info:", err);
//   }
// }



// displayMainInfo()


// displayAllUserProfile()

// async function displayTrackedProfile(currentUser) {
//   const userTrackRef = doc(colRef, currentUser.uid)
//   const summaryRef = collection(userTrackRef, "summaryInfo")
  
//   try {
//     let querySnap = await getDocs(summaryRef);
//     if (querySnap.empty) {
//       historyDisplay.innerHTML = `
//         <tr>
//             <td
//                 colspan="7" class="px-6 py-4 whitespace-no-wrap text-2xl text-sm text-center leading-5">
//                 No data here yet
//             </td>
            
//         </tr>
//       `
//       return
//     }
//     historyDisplay.innerHTML = ""
//     querySnap.forEach((docSnap) =>{
//       const actualData = docSnap.data()
//       historyDisplay.innerHTML += `
//             <tr>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <p class="capitalize font-bold">${actualData.type}</p>
//                     <p class="capitalize font-semibold text-xs text-black-400">${actualData.category}
//                     </p>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <p>$${actualData.amount}</p>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <div class="flex text-black-500">
//                         <textarea name="" disabled>${actualData.description}</textarea>
//                     </div>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <div class="flex text-black-500">
//                         <p>${actualData.date.toDate().toLocaleString()}</p>
//                     </div>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <div class="flex space-x-4">
//                         <a href="#" class="text-blue-500 hover:text-blue-600">
//                         <svg xmlns="http://www.w3.org/2000/svg"
//                             class="w-5 h-5 mr-1"
//                             fill="none" viewBox="0 0 24 24"
//                             stroke="currentColor">
//                             <path stroke-linecap="round"
//                                 stroke-linejoin="round"
//                                 stroke-width="2"
//                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                         <p>Edit</p>
//                         </a>
//                         <a href="#" class="text-red-500 hover:text-red-600">
//                         <svg xmlns="http://www.w3.org/2000/svg"
//                             class="w-5 h-5 mr-1 ml-3"
//                             fill="none" viewBox="0 0 24 24"
//                             stroke="currentColor">
//                             <path stroke-linecap="round"
//                                 stroke-linejoin="round"
//                                 stroke-width="2"
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <p>Delete</p>
//                         </a>
//                     </div>
//                 </td>
//             </tr>
//       `
//     })

//   } catch (err) {
//     console.log(err);
//   }
// }


// const switchToggle = document.getElementById('switch-toggle');

// Load saved theme
// let isDarkmode = localStorage.getItem('isDarkmode') === 'true';


// switchToggle.addEventListener('click', toggleTheme);
// function toggleTheme() {
//   isDarkmode = !isDarkmode;
//   localStorage.setItem('isDarkmode', isDarkmode);
//   switchTheme();
// }

// function switchTheme() {
//   const infoBody = document.getElementById("infoBody")
//   if (isDarkmode) {
//     document.body.classList.add('dark'); // optional: apply dark theme styles
//     switchToggle.classList.remove('bg-yellow-500','-translate-x-2');
//     switchToggle.classList.add('bg-gray-700','translate-x-full');
//     infoBody.style.backgroundColor = "black";
//     infoBody.style.color = "white";
//     infoBody.childElementCount("4").style.backgroundColor = "black"
//     setTimeout(() => {
//       switchToggle.innerHTML = darkIcon;
//     }, 100);
//   } else {
//     document.body.classList.remove('dark'); // optional: remove dark theme
//     switchToggle.classList.add('bg-yellow-500','-translate-x-2');
//     switchToggle.classList.remove('bg-gray-700','translate-x-full');
//     infoBody.style.backgroundColor = "white";
//     infoBody.style.color = "black";
//     infoBody.childElementCount("4").style.backgroundColor = "black"
//     setTimeout(() => {
//       switchToggle.innerHTML = lightIcon;
//     }, 100);
//   }
// }

// Apply theme on page load
// switchTheme();
// const chartCanvas = document.getElementById('monthlyChart');
// chartCanvas.classList.add("hidden")



// async function loadFinancialSummary() {
//   const loader = document.getElementById('chartLoader');
//   const chartCanvas = document.getElementById('monthlyChart');
//   const filterSelect = document.getElementById('summaryFilter'); // Add <select id="summaryFilter"> to your HTML

//   // Show loader and hide chart
//   loader.classList.remove('hidden');
  
//   chartCanvas.classList.add('hidden');
  
//   try {
//     const userRef = doc(colRef, currentUser.uid);
//     const summaryRef = collection(userRef, "summaryInfo");
//     const snapshot = await getDocs(summaryRef);
//     const now = new Date();
//     const filterType = filterSelect && filterSelect.value ? filterSelect.value : 'daily';

//     // Process all transactions
//     const allTransactions = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       allTransactions.push({
//         amount: Number(data.amount || 0),
//         type: data.type,
//         date: data.date.toDate()
//       });
//     });

//     // Group data based on selected filter
//     let groupedData = {};
//     let totals = { income: 0, expense: 0, balance: 0 };

//     if (filterType === 'daily') {
//       // Group by day
//       for (let i = 15; i >= 0; i--) { // Last 30 days
//         const date = new Date(now);
//         date.setDate(date.getDate() - i);
//         const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         groupedData[key] = { income: 0, expense: 0 };
//       }
//     } else if (filterType === 'weekly') {
//       // Group by week
//       for (let i = 4; i >= 0; i--) { // Last 12 weeks
//         const date = new Date(now);
//         date.setDate(date.getDate() - (i * 7));
//         const weekNum = getWeekNumber(date);
//         const key = `Week ${weekNum.week}, ${weekNum.year}`;
//         groupedData[key] = { income: 0, expense: 0 };
//       }
//     } else {
//       // Default: monthly
//       for (let i = 5; i >= 0; i--) { // Last 6 months
//         const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
//         groupedData[key] = { income: 0, expense: 0 };
//       }
//     }

//     // Process transactions into groups
//     allTransactions.forEach(transaction => {
//       let key;
//       const date = transaction.date;
      
//       if (filterType === 'daily') {
//         key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//       } else if (filterType === 'weekly') {
//         const weekNum = getWeekNumber(date);
//         key = `Week ${weekNum.week}, ${weekNum.year}`;
//       } else {
//         key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
//       }

//       if (!groupedData[key]) {
//         groupedData[key] = { income: 0, expense: 0 };
//       }

//       if (transaction.type === 'income') {
//         groupedData[key].income += transaction.amount;
//         totals.income += transaction.amount;
//       } else {
//         groupedData[key].expense += transaction.amount;
//         totals.expense += transaction.amount;
//       }
//     });

//     totals.balance = totals.income - totals.expense;

//     // Sort data chronologically
//     const sortedKeys = Object.keys(groupedData).sort((a, b) => {
//       if (filterType === 'daily') {
//         return new Date(a) - new Date(b);
//       } else if (filterType === 'weekly') {
//         const [weekA, yearA] = a.replace('Week ', '').split(', ');
//         const [weekB, yearB] = b.replace('Week ', '').split(', ');
//         return new Date(yearA, 0, weekA * 7) - new Date(yearB, 0, weekB * 7);
//       } else {
//         return new Date(a) - new Date(b);
//       }
//     });

//     const labels = sortedKeys;
//     const incomes = labels.map(key => groupedData[key].income);
//     const expenses = labels.map(key => groupedData[key].expense);
//     const balances = labels.map(key => groupedData[key].income - groupedData[key].expense);

//     // Update totals display
//     document.getElementById('totalIncome').textContent = `$${totals.income.toLocaleString()}`;
//     document.getElementById('totalExpense').textContent = `$${totals.expense.toLocaleString()}`;
//     document.getElementById('totalBalance').textContent = `$${totals.balance.toLocaleString()}`;

//     // Create or update chart
//     const ctx = chartCanvas.getContext('2d');
//     if (window.summaryChartInstance) window.summaryChartInstance.destroy();

//     window.summaryChartInstance = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [
//           { label: 'Income', data: incomes, backgroundColor: '#34D399' },
//           { label: 'Expenses', data: expenses, backgroundColor: '#F87171' },
//           { label: 'Balance', data: balances, backgroundColor: '#60A5FA' }
//         ]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { position: 'top' },
//           tooltip: {
//             callbacks: {
//               label: item => `${item.dataset.label}: $${item.raw.toLocaleString()}`
//             }
//           },
//           ...(allTransactions.length === 0 && {
//             title: {
//               display: true,
//               text: 'No transactions yet. Add some to see your financial summary!',
//               color: '#6B7280',
//               font: {
//                 size: 16,
//                 weight: 'normal'
//               },
//               padding: {
//                 top: 20,
//                 bottom: 20
//               }
//             }
//           })
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: { 
//               callback: val => `$${val.toLocaleString()}`,
//               ...(allTransactions.length === 0 && { stepSize: 10000 })
//             }
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error("Error loading financial summary:", error);
//     loader.textContent = "Failed to load data. Please try again.";
//   } finally {
//     loader.classList.add('hidden');
//     chartCanvas.classList.remove('hidden');
//   }
// }

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
        
        // displayTrackedProfile(user);
        // displayMainInfo(user)
        // loadCategoryChart();
        // document.addEventListener('DOMContentLoaded', loadCategoryChart);
        // document.getElementById('summaryFilter')?.addEventListener('change', loadFinancialSummary);
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
})


