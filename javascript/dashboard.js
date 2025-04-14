import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,Timestamp, increment,addDoc, collection,setDoc, getDoc,getDocs, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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

const isDark = document.documentElement.classList.contains('dark');
async function loadCategoryChart() {
  const categoryCanvas = document.getElementById('categoryChart');
  // const categoryLoader = document.getElementById('categoryLoader');
  
  // Show loader and hide chart
  // categoryLoader.classList.remove('hidden');
  categoryCanvas.classList.remove('hidden');

  try {
    const userTrackRef = doc(colRef, currentUser.uid);
    const summaryRef = collection(userTrackRef, "summaryInfo");
    const querySnapshot = await getDocs(summaryRef);
    
    // Default categories (only expenses)
    const defaultCategories = {
      'Food': 0,
      'Transportation': 0,
      'Housing': 0,
      'Entertainment': 0,
      'Utilities': 0,
      'Healthcare': 0,
      'Shopping': 0,
      'Other': 0
    };

    const categoryTotals = {...defaultCategories};
    let hasData = false;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category || 'Other';
      const amount = Number(data.amount || 0);
      const type = data.type; // Assuming your data has a 'type' field ('expense' or 'income')
      
      // Only process if it's an expense
      if (type === 'expense' && amount > 0) {
        hasData = true;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    // Rest of your code remains **identical** (same chart design)
    const chartData = hasData ? 
      Object.entries(categoryTotals).filter(([_, value]) => value > 0) :
      Object.entries(defaultCategories);

    const labels = chartData.map(([label]) => label);
    const values = chartData.map(([_, value]) => value);

    // Destroy previous chart instance
    const ctx = categoryCanvas.getContext('2d');
    if (window.categoryChartInstance) {
      window.categoryChartInstance.destroy();
    }

    // Create new chart (same as your original design)
    window.categoryChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Expenses by Category',
          data: values,
          backgroundColor: [
            '#34D399', '#F87171', '#FBBF24', '#60A5FA',
            '#A78BFA', '#38BDF8', '#F472B6', '#4ADE80'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        plugins: {
          legend: {
            labels: {
              color: isDark ? '#111827' : 'black', // dark text on light bg (dark mode), light text on dark bg (light mode)
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#f3f4f6' : '#1f2937',  // light bg for dark mode, dark bg for light mode
            titleColor: isDark ? '#1f2937' : '#facc15',       // dark title in dark mode, bright in light
            bodyColor: isDark ? '#1f2937' : '#f9fafb',        // dark text in dark mode, light text in light
          },
          ...( !hasData && {
            title: {
              display: true,
              text: 'No expenses yet. Add some to see your breakdown!',
              color: isDark ? '#9CA3AF' : '#6B7280',
              font: {
                size: 16,
                weight: 'normal'
              },
              padding: {
                top: 20,
                bottom: 20
              }
            }
          })
        }
      }
    });

  } catch (error) {
    console.error("Error loading expense chart:", error);
    // categoryLoader.innerHTML = `<p class="text-red-500">Failed to load data. Please try again.</p>`;
  } finally {
    // Hide loader and show chart
    // categoryLoader.classList.add('hidden');
    categoryCanvas.classList.remove('hidden');
  }
}






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





const incomeFormHTML = `
      <div class="w-full bg-white p-6 rounded-lg shadow-md mt-4 space-y-4">
        <h2 class="text-xl font-bold mb-4">Add New Income</h2>

        <!-- Wrapper that allows horizontal scroll on medium+ screens -->
        <div class="overflow-x-auto md:overflow-x-scroll">
          <div class="flex flex-col xl:flex-row  md:flex-row md:gap-6 gap-4 sm:flex-col sm:w-full">
            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Amount:</label>
              <input type="number" id="amountInp" class="w-full p-2 border rounded" placeholder="Enter amount" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Description:</label>
              <input type="text" id="incomeDescription" class="w-full p-2 border rounded" placeholder="Income description" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Category:</label>
              <select id="incomeCategory" class="w-1/2 p-2 border rounded">
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="gift">Gift</option>
                <option value="investment">Investment</option>
              </select>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button id="submitIncome" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit</button>
        </div>
      </div>
    `;



const budgetFormHTML = `
      <div class="w-full bg-white p-6 rounded-lg shadow-md mt-0 space-y-4">
        <h2 class="text-xl font-bold mb-4">Add New budget</h2>

        <!-- Wrapper that allows horizontal scroll on medium+ screens -->
        <div class="overflow-x-auto md:overflow-x-scroll">
          <div class="flex flex-col xl:flex-row  md:flex-row md:gap-6 gap-4 sm:flex-col sm:w-full">
            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Amount:</label>
              <input type="number" id="amountInp" class="w-full p-2 border rounded" placeholder="Enter amount" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Description:</label>
              <input type="text" id="budgetDescription" class="w-full p-2 border rounded" placeholder="budget description" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Category:</label>
              <select id="budgetCategory" class="w-1/2 p-2 border rounded">
                <option value="Housing">Housing</option>
                <option value="Transportation">Transportation</option>
                <option value="Education">Education</option>
                <option value="Insurance">Insurance</option>
                <option value="Travel & Accommodation">Travel & Accommodation</option>
              </select>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button id="submitBudget" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit</button>
        </div>
      </div>
    `;


const expenseFormHTML = `
      <div class="w-full bg-white p-6 rounded-lg shadow-md mt-4 ">
        <h2 class="text-xl font-bold mb-4">Add New Expense</h2>

        <!-- Wrapper that allows horizontal scroll on medium+ screens -->
        <div class="overflow-x-auto md:overflow-x-scroll">
          <div class="flex flex-col xl:flex-row  md:flex-row md:gap-6 gap-4 sm:flex-col sm:w-full">
            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Amount:</label>
              <input type="number" id="amountInp" class="w-full p-2 border rounded" placeholder="Enter amount" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Description:</label>
              <input type="text" id="expenseDescription" class="w-full p-2 border rounded" placeholder="Expense description" />
            </div>

            <div class="flex-1 min-w-[250px]">
              <label class="block font-medium mb-1">Category:</label>
              <select id="expenseCategory" class="w-1/2 p-2 border rounded">
                <option value="Fuel">Fuel</option>
                <option value="Food">Food</option>
                <option value="School Fees">School Fees</option>
                <option value="Medical Bills">Medical Bills</option>
                <option value="Health and Wellness">Health and Wellness</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Travel">Travel</option>
                <option value="Loan Payments">Loan Payments</option>
                <option value="Repairs">Repairs</option>
                <option value="Shopping">Shopping</option>
                <option value="Mobile Data">Mobile Data</option>
                <option value="Physical Fitness">Physical Fitness</option>
              </select>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button id="submitExpense" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit</button>
        </div>
      </div>
    `;

// let updateInfo;
let summaryInfo;

document.addEventListener("click", async (e) => {
  console.log(e.target.nodeName);
  
  const userTrackRef = doc(colRef, currentUser.uid)
  const summaryRef = collection(userTrackRef, "summaryInfo")
  const amount = document.getElementById("amountInp");
  const amountIncome = document.getElementById("amountIncome");
  const incomeCategory = document.getElementById("incomeCategory");
  const incomeDescription = document.getElementById("incomeDescription");
  
  const expenseCategory = document.getElementById("expenseCategory"); // if you have this ID
  const expenseDescription = document.getElementById("expenseDescription"); // same here
  
    summaryInfo = {
        type: "income",
        amount:  0,
        date: Timestamp.now()
    }
    if (e.target.closest("#addIncome")) {
      IncomeModal.classList.remove("hidden");
      ExpenseModal.classList.add("hidden")
    }
    if (e.target.id === "cancelInput") {
      IncomeModal.classList.add("hidden") ||
      ExpenseModal.classList.add("hidden");
    }

    if (e.target.closest("#submitIncome")) {
      e.preventDefault();
      console.log("Amount value:", amountIncome.value);

    if (
      !incomeCategory.value.trim() || 
      !incomeDescription.value.trim() || 
      !amountIncome.value
    ) {
      alert("Ensure all fields are filled");
      return;
    }
      
      const enteredIncomeAmount = parseFloat(amountIncome.value.trim());
      summaryInfo.type = "income"
      summaryInfo.description = incomeDescription.value
      summaryInfo.amount = enteredIncomeAmount
      summaryInfo.category = incomeCategory.value
      try {
        await addDoc(summaryRef, summaryInfo)
        alert("Income information added successfully")
        window.location.reload();
      } catch (err) {
        console.log(err);
        
      }
      
      // Add your submit logic here
    }


  
    if (e.target.closest("#addExpense")) {
        ExpenseModal.classList.remove("hidden")
        IncomeModal.classList.add("hidden")
    }
    if (e.target.closest("#submitExpense")) {
        e.preventDefault();
        if (expenseCategory.value === "" 
            || expenseDescription.value === "" || amount.value === "") {
            alert("Ensure all fields are filled")
            return
        }
        const enteredIncomeAmount = parseFloat(amount.value.trim());
        // updateInfo.Balance -= enteredIncomeAmount;
        // updateInfo.Expense += enteredIncomeAmount;
        summaryInfo.type = "expense"
        summaryInfo.description = expenseDescription.value
        summaryInfo.amount = enteredIncomeAmount
        summaryInfo.category = expenseCategory.value
        try {
          await addDoc(summaryRef, summaryInfo)
          // await addDoc(trackDetailsRef, trackDetails);
          // await setDoc(docRef, updateInfo)
          Swal.fire({
            icon: 'success',    // Success icon
            title: 'Success!',  // Title
            text: 'Your Expense information has been added successfully.', // Message
            confirmButtonText: 'Okay'  // Button text
          });
          ExpenseModal.classList.add("hidden")
          // window.location.reload();
        } catch (err) {
          console.log(err);
          
        }
        
        // Add your submit logic here
      }
  
  
  
  });
  
  document.addEventListener("click", async (e) =>{

    if (e.target.closest("#logOutBtn")) {
      e.preventDefault();
      await signOut(auth);
      console.log("User logged out");
      location.href = "../pages/login.html";
    }
  })
  document.getElementById("historyDisplay").addEventListener("click", async (e)=>{
    if (e.target.nodeName === "A") {
      let id = e.target.id
      if (e.target.classList.contains("text-blue-500")) {
        // editTrackingInfo(id)
        e.stopPropagation()
        ExpenseModal.classList.remove("hidden")
      }
      if (e.target.classList.contains("text-red-500")) {
        // deleteTrackingInfo(id)
      }
    }
  })



async function displayMainInfo(currentUser) {
  const userTrackRef = doc(colRef, currentUser.uid);
  const summaryRef = collection(userTrackRef, "summaryInfo");

  try {
    const summarySnap = await getDocs(summaryRef);

    let totals = { income: 0, expense: 0, balance: 0 };

    summarySnap.forEach(doc => {
      const data = doc.data();
      const amount = Number(data.amount || 0);
      const type = data.type;

      if (type === 'income') {
        totals.income += amount;
      } else if (type === 'expense') {
        totals.expense += amount;
      }
    });

    totals.balance = totals.income - totals.expense;

    document.getElementById('totalIncome').textContent = `$${totals.income.toLocaleString()}`;
    document.getElementById('totalExpense').textContent = `$${totals.expense.toLocaleString()}`;
    document.getElementById('totalBalance').textContent = `$${totals.balance.toLocaleString()}`;

  } catch (err) {
    console.error("Error displaying main info:", err);
  }
}



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
//       const historyID = docSnap.id
//       historyDisplay.innerHTML += `
//             <tr class="bg-white dark:bg-gray-300 border-b border-gray-200">
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
//                     <div class="flex text-black-500 dark:text-white">
//                         <textarea class="bg-white dark:bg-gray-300" name="" disabled>${actualData.description}</textarea>
//                     </div>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <div class="flex text-black-500 dark:text-white">
//                         <p>${actualData.date.toDate().toLocaleString()}</p>
//                     </div>
//                 </td>
//                 <td
//                     class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                     <div class="flex space-x-4">
//                         <a href="#" id="${historyID}" class="text-blue-500 hover:text-blue-600">
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
//                         <a href="#" id="${historyID}" class="text-red-500 hover:text-red-600">
//                         <svg xmlns="http://www.w3.org/2000/svg"
//                             class="w-5 h-5 mr-1 ml-3"
//                             fill="none" viewBox="0 0 24 24"
//                             stroke="currentColor">
//                             <path stroke-linecap="round"
//                                 stroke-linejoin="round"
//                                 stroke-width="2"
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <p >Delete</p>
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

async function displayTrackedProfile(currentUser) {
  const userTrackRef = doc(colRef, currentUser.uid);
  const summaryRef = collection(userTrackRef, "summaryInfo");
  const maxToShow = 3;  // Limit to 5 items initially
  
  try {
    let querySnap = await getDocs(summaryRef);
    if (querySnap.empty) {
      historyDisplay.innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-4 whitespace-no-wrap text-2xl text-sm text-center leading-5">
                No data here yet
            </td>
        </tr>
      `;
      return;
    }
    
    // Get all the documents (history rows)
    const allDocs = querySnap.docs.map(docSnap => docSnap.data());
    historyDisplay.innerHTML = ""; // Clear any previous content

    // Display only the first 5 items
    const itemsToShow = allDocs.slice(0, maxToShow);
    
    itemsToShow.forEach((item) => {
      historyDisplay.innerHTML += renderHistoryRow(item);
    });

    // If there are more than 5 items, show the "See All" button
    if (allDocs.length > maxToShow) {
      const seeAllBtn = document.createElement("button");
      seeAllBtn.textContent = "See All";
      seeAllBtn.className = "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";

      seeAllBtn.addEventListener("click", () => {
        historyDisplay.innerHTML = "";  // Clear the current content

        // Add all items to the table
        allDocs.forEach(item => {
          historyDisplay.innerHTML += renderHistoryRow(item);
        });

        // Remove the "See All" button after showing all data
        seeAllBtn.remove();
      });

      // Append the "See All" button after all rows have been added
      historyDisplay.parentElement.appendChild(seeAllBtn);
    }

  } catch (err) {
    console.log(err);
  }
}

// Helper function to render the history row
function renderHistoryRow(actualData) {
  const historyID = actualData.id; // Assuming this is the document ID
  return `
    <tr class="bg-white dark:bg-gray-300 border-b border-gray-200">
      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <p class="capitalize font-bold">${actualData.type}</p>
        <p class="capitalize font-semibold text-xs text-black-400">${actualData.category}</p>
      </td>
      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <p>$${actualData.amount}</p>
      </td>
      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <div class="flex text-black-500 dark:text-black">
          <textarea class="bg-white dark:bg-gray-300" name="" disabled>${actualData.description}</textarea>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <div class="flex text-black-500 dark:text-black">
          <p>${actualData.date.toDate().toLocaleString()}</p>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <div class="flex space-x-4">
          <a href="#" id="${historyID}" class="text-blue-500 p-1 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p>Edit</p>
          </a>
          <a href="#" id="${historyID}" class="text-red-500 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p>Delete</p>
          </a>
        </div>
      </td>
    </tr>
  `;
}



const chartCanvas = document.getElementById('monthlyChart');
chartCanvas.classList.add("hidden")


// const isDark = document.documentElement.classList.contains('dark');

// Define colors based on the theme (invert for dark mode)
const textColor = isDark ? '#1f2937' : '#f9fafb';  // dark text on light bg vs light text on dark bg
const gridColor = isDark ? '#d1d5db' : '#4b5563';  // soft grid lines
const tooltipBg = isDark ? '#f3f4f6' : '#1f2937';
const tooltipText = isDark ? '#1f2937' : '#f9fafb';
const tooltipTitle = isDark ? '#111827' : '#facc15';

async function loadFinancialSummary() {
  // const loader = document.getElementById('chartLoader');
  const chartCanvas = document.getElementById('monthlyChart');
  const filterSelect = document.getElementById('summaryFilter'); // Add <select id="summaryFilter"> to your HTML

  // Show loader and hide chart
  // loader.classList.remove('hidden');
  
  chartCanvas.classList.add('hidden');
  
  try {
    const userRef = doc(colRef, currentUser.uid);
    const summaryRef = collection(userRef, "summaryInfo");
    const snapshot = await getDocs(summaryRef);
    const now = new Date();
    const filterType = filterSelect && filterSelect.value ? filterSelect.value : 'daily';

    // Process all transactions
    const allTransactions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      allTransactions.push({
        amount: Number(data.amount || 0),
        type: data.type,
        date: data.date.toDate()
      });
    });

    // Group data based on selected filter
    let groupedData = {};
    let totals = { income: 0, expense: 0, balance: 0 };

    if (filterType === 'daily') {
      // Group by day
      for (let i = 15; i >= 0; i--) { // Last 30 days
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        groupedData[key] = { income: 0, expense: 0 };
      }
    } else if (filterType === 'weekly') {
      // Group by week
      for (let i = 4; i >= 0; i--) { // Last 12 weeks
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        const weekNum = getWeekNumber(date);
        const key = `Week ${weekNum.week}, ${weekNum.year}`;
        groupedData[key] = { income: 0, expense: 0 };
      }
    } else {
      // Default: monthly
      for (let i = 5; i >= 0; i--) { // Last 6 months
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        groupedData[key] = { income: 0, expense: 0 };
      }
    }

    // Process transactions into groups
    allTransactions.forEach(transaction => {
      let key;
      const date = transaction.date;
      
      if (filterType === 'daily') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (filterType === 'weekly') {
        const weekNum = getWeekNumber(date);
        key = `Week ${weekNum.week}, ${weekNum.year}`;
      } else {
        key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      }

      if (!groupedData[key]) {
        groupedData[key] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        groupedData[key].income += transaction.amount;
        totals.income += transaction.amount;
      } else {
        groupedData[key].expense += transaction.amount;
        totals.expense += transaction.amount;
      }
    });

    totals.balance = totals.income - totals.expense;

    // Sort data chronologically
    const sortedKeys = Object.keys(groupedData).sort((a, b) => {
      if (filterType === 'daily') {
        return new Date(a) - new Date(b);
      } else if (filterType === 'weekly') {
        const [weekA, yearA] = a.replace('Week ', '').split(', ');
        const [weekB, yearB] = b.replace('Week ', '').split(', ');
        return new Date(yearA, 0, weekA * 7) - new Date(yearB, 0, weekB * 7);
      } else {
        return new Date(a) - new Date(b);
      }
    });

    const labels = sortedKeys;
    const incomes = labels.map(key => groupedData[key].income);
    const expenses = labels.map(key => groupedData[key].expense);
    const balances = labels.map(key => groupedData[key].income - groupedData[key].expense);

    // Update totals display
    document.getElementById('totalIncome').textContent = `$${totals.income.toLocaleString()}`;
    document.getElementById('totalExpense').textContent = `$${totals.expense.toLocaleString()}`;
    document.getElementById('totalBalance').textContent = `$${totals.balance.toLocaleString()}`;

    // Create or update chart
    const ctx = chartCanvas.getContext('2d');
    if (window.summaryChartInstance) window.summaryChartInstance.destroy();

    window.summaryChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Income', data: incomes, backgroundColor: '#34D399' },
          { label: 'Expenses', data: expenses, backgroundColor: '#F87171' },
          { label: 'Balance', data: balances, backgroundColor: '#60A5FA' }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: tooltipTitle,
            bodyColor: tooltipText,
            callbacks: {
              label: item => `${item.dataset.label}: $${item.raw.toLocaleString()}`
            }
          },
          ...(allTransactions.length === 0 && {
            title: {
              display: true,
              text: 'No transactions yet. Add some to see your financial summary!',
              color: textColor,
              font: {
                size: 16,
                weight: 'normal'
              },
              padding: {
                top: 20,
                bottom: 20
              }
            }
          })
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              callback: val => `$${val.toLocaleString()}`,
              ...(allTransactions.length === 0 && { stepSize: 10000 })
            },
            grid: {
              color: gridColor
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: gridColor
            }
          }
        }
      }
      
    });

  } catch (error) {
    console.error("Error loading financial summary:", error);
    // loader.textContent = "Failed to load data. Please try again.";
  } finally {
    // loader.classList.add('hidden');
    chartCanvas.classList.remove('hidden');
  }
}
// loadFinancialSummary();

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("toBeload").classList.add("hidden");
    document.getElementById("loadedContent").classList.remove("hidden");
  }, 1000);
});
// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return {
    week: 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7),
    year: d.getFullYear()
  };
}

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
  loadCategoryChart();
  loadFinancialSummary();
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
        displayAllUserProfile(user);
        displayTrackedProfile(user);
        displayMainInfo(user)
        loadCategoryChart();
        loadFinancialSummary();
        // budgetAlert();
        // document.addEventListener('DOMContentLoaded', loadCategoryChart);
        document.getElementById('summaryFilter')?.addEventListener('change', loadFinancialSummary);
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
})


