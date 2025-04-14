import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,where,query,orderBy,Timestamp, increment,addDoc, collection,setDoc, getDoc,getDocs, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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




async function loadCategoryChart() {
    const categoryCanvas = document.getElementById('categoryChart');
    const categoryLoader = document.getElementById('categoryLoader');
    
    // Show loader and hide chart
    categoryLoader?.classList.remove('hidden');
    categoryCanvas.classList.add('hidden');
  
    try {
      const userTrackRef = doc(colRef, currentUser.uid);
      const summaryRef = collection(userTrackRef, "summaryInfo");
      const querySnapshot = await getDocs(summaryRef);
      
      // Default expense categories only
      const expenseCategories = {
        'Food': 0,
        'Transportation': 0,
        'Housing': 0,
        'Entertainment': 0,
        'Utilities': 0,
        'Healthcare': 0,
        'Shopping': 0,
        'Other Expenses': 0
      };
  
      const categoryTotals = {...expenseCategories};
      let hasExpenseData = false;
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const amount = Number(data.amount || 0);
        
        // Process ONLY expenses
        if (data.type === 'expense' && amount > 0) {
          hasExpenseData = true;
          const category = data.category || 'Other Expenses';
          categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
        }
      });
  
      // Prepare chart data - only show categories with expenses
      const chartData = Object.entries(categoryTotals)
        .filter(([_, value]) => value > 0);
  
      const labels = chartData.map(([label]) => label);
      const values = chartData.map(([_, value]) => value);
  
      // Destroy previous chart instance
      if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
      }
  
      // Get canvas context with proper dimensions
      const ctx = categoryCanvas.getContext('2d');
      
      // Fix for chart sizing - ensure parent container has fixed dimensions
      const container = categoryCanvas.parentElement;
      container.style.position = 'relative';
      container.style.height = '384px'; // Match your h-64 (16rem = 256px) plus legend space
  
      // Create new chart focused on expenses
      window.categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels.length ? labels : Object.keys(expenseCategories),
          datasets: [{
            label: 'Expenses by Category',
            data: labels.length ? values : Array(Object.keys(expenseCategories).length).fill(0),
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
          maintainAspectRatio: false, // Critical for fixed container
          layout: {
            padding: {
              bottom: 20 // Extra space for legend
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#374151',
                font: {
                  size: 14,
                  weight: 'bold'
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: $${tooltipItem.raw.toLocaleString()}`;
                }
              }
            },
            ...(!hasExpenseData && {
              title: {
                display: true,
                text: 'No expenses recorded yet',
                color: '#6B7280',
                font: {
                  size: 16,
                  weight: 'normal'
                },
                position: 'top'
              }
            })
          }
        }
      });
  
    } catch (error) {
      console.error("Error loading expense chart:", error);
      if (categoryLoader) {
        categoryLoader.innerHTML = `
          <p class="text-red-500 text-center p-4">
            Failed to load expense data. Please refresh or try again later.
          </p>
        `;
      }
    } finally {
      if (categoryLoader) categoryLoader.classList.add('hidden');
      categoryCanvas.classList.remove('hidden');
    }
  }


// Function to fetch and generate Expense Report
// const startDate = document.getElementById("startDate").value
// const endDate = document.getElementById("endDate").value
// generateReportBtn.addEventListener("click", generateExpenseReport)
// async function generateExpenseReport(startDate, endDate) {
//   const summaryRef = collection(db, "Users", currentUser.uid, "summaryInfo");
//   const q = query(
//     summaryRef,
//     where("type", "==", "expense"),
//     where("date", ">=", startDate),
//     where("date", "<=", endDate),
//     orderBy("date")
//   );

//   const querySnapshot = await getDocs(q);
//   let totalExpenses = 0;
//   querySnapshot.forEach((doc) => {
//     const data = doc.data();
//     totalExpenses += data.amount;
//   });

//   return totalExpenses;
// }

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








document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("toBeload").classList.add("hidden");
    document.getElementById("loadedContent").classList.remove("hidden");
  }, 1000);
});



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
    // document.getElementById('totalIncome').textContent = `$${totals.income.toLocaleString()}`;
    // document.getElementById('totalExpense').textContent = `$${totals.expense.toLocaleString()}`;
    // document.getElementById('totalBalance').textContent = `$${totals.balance.toLocaleString()}`;

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
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: item => `${item.dataset.label}: $${item.raw.toLocaleString()}`
            }
          },
          ...(allTransactions.length === 0 && {
            title: {
              display: true,
              text: 'No transactions yet. Add some to see your financial summary!',
              color: '#6B7280',
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
              callback: val => `$${val.toLocaleString()}`,
              ...(allTransactions.length === 0 && { stepSize: 10000 })
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



  const reportBtn = document.getElementById('generateReportBtn');

  reportBtn.addEventListener('click', async () => {
    const reportType = document.getElementById('reportType').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    endDate.setHours(23, 59, 59); // include whole end day

    const currentUser = auth.currentUser
    const uid = currentUser.uid; // Replace with actual user ID

    let dataRef = collection(db, `Users/${uid}/summaryInfo`);
    const q = query(
      dataRef,
      where('type', '==', reportType),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });

    renderReport(results);
    // renderReportSummary(results);
  });



  function renderReportSummary(data) {
    console.log("Fetched data:", data);
  
    const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);
  
    // Top Category
    const categoryMap = {};
    data.forEach(item => {
      if (!categoryMap[item.category]) categoryMap[item.category] = 0;
      categoryMap[item.category] += item.amount;
    });
  
    let topCategory = '';
    let topCategoryAmount = 0;
  
    for (let [category, amount] of Object.entries(categoryMap)) {
      if (amount > topCategoryAmount) {
        topCategory = category;
        topCategoryAmount = amount;
      }
    }
  
    // Average Daily Spend
    const uniqueDates = [...new Set(data.map(item => new Date(item.date.seconds * 1000).toDateString()))];
    const avgDailySpend = (totalSpending / uniqueDates.length).toFixed(2);
  
    // Budget Adherence (Mocked for now)
    // const adherencePercentage = 82; // Replace with actual logic later
    // const overCategories = 3; // Replace with actual logic later
  
    // 🧠 Update UI Cards
    document.getElementById("spendingTotal").textContent = `$${totalSpending.toFixed(2)}`;
    document.getElementById("topCategory").textContent = `${topCategory}`;
    document.getElementById("topCategoryAmount").textContent = `$${topCategoryAmount.toFixed(2)} (${((topCategoryAmount / totalSpending) * 100).toFixed(0)}%)`;
    document.getElementById("spendDaily").textContent = `$${avgDailySpend}`;
    // document.getElementById("budgetAdherence").textContent = `${adherencePercentage}%`;
    // document.getElementById("budgetNote").textContent = `${overCategories} categories over`;
  
    // ✅ Update Chart and Table
    // renderCategoryChart(data);
    // renderLineChart(data); // <-- Coming in Step 2
    // renderTable(data);
  }
  // Example Firebase Fetch (adjust based on your code)
const fetchData = async () => {
  const uid = currentUser.uid;
  const snapshot = await collection(db, `Users/${uid}/summaryInfo`);
  const q = query(
    snapshot,
    where('type', '==', "expense"),
  );

  const querySnapshot = await getDocs(q);
  const results = [];

  querySnapshot.forEach(doc => {
    results.push({ id: doc.id, ...doc.data() });
  });

  // Call the function to render the report summary immediately after fetching data
  renderReportSummary(results);
}

// Call fetchData immediately or on window load (if using vanilla JS) // Or you can trigger this when necessary (like on page load)

  function renderReport(data) {
    // ✅ You can calculate totals, populate cards, chart, and table here
    console.log("Fetched data:", data);

    // Example: populate table
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = ''; // Clear previous rows

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(item.date.seconds * 1000).toLocaleDateString()}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${item.type}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.category}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-${item.type === 'expense' ? 'red' : 'green'}-600">$${item.amount}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Within Budget</span>
        </td>
      `;
      tbody.appendChild(row);
    });
    tbody.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }




  async function calculateBudgetAdherence(currentUser) {
    const budgetSnap = await getDocs(collection(db, "Users", currentUser.uid, "budgetInfo"));
    const expenseSnap = await getDocs(collection(db, "Users", currentUser.uid, "summaryInfo"));
  
    const budgets = {};
    const expenses = {};
  
    budgetSnap.forEach(doc => {
      const data = doc.data();
      budgets[data.category] = data.amount;
    });
  
    expenseSnap.forEach(doc => {
      const data = doc.data();
      if (data.type === "expense") {
        if (!expenses[data.category]) expenses[data.category] = 0;
        expenses[data.category] += data.amount;
      }
    });
  
    return { budgets, expenses };
  }

  
  function getAdherenceStats(budgets, expenses) {
    let overBudgetCount = 0;
    let totalAdherenceSum = 0;
    let trackedCategories = 0;
  
    for (let category in budgets) {
      const budget = budgets[category];
      const spent = expenses[category] || 0;
      const adherence = (spent / budget) * 100;
  
      totalAdherenceSum += adherence;
      trackedCategories++;
  
      if (adherence > 100) overBudgetCount++;
    }
  
    const averageAdherence = (totalAdherenceSum / trackedCategories).toFixed(0);
  
    return {
      averageAdherence,
      overBudgetCount
    };
  }
  async function renderBudgetAdherence(currentUser) {
    const { budgets, expenses } = await calculateBudgetAdherence(currentUser);
    const { averageAdherence, overBudgetCount } = getAdherenceStats(budgets, expenses);
  
    document.getElementById("budgetAdherence").textContent = `${averageAdherence}%`;
    document.getElementById("budgetNote").textContent = `${overBudgetCount} categories over`;
  }
    

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
        // displayTrackedProfile(user);
        // displayMainInfo(user)
        loadCategoryChart(user);
       fetchData();
       renderBudgetAdherence(currentUser);
       loadFinancialSummary(user);
        // document.addEventListener('DOMContentLoaded', loadCategoryChart);
        document.getElementById('summaryFilter')?.addEventListener('change', loadFinancialSummary);
    }else{
        console.log("Not signed in yet.");
        location.href = "../pages/login.html"
    }
})

