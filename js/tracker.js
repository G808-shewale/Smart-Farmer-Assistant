/* ==========================================================================
   Smart Farmer Assistant - Module 2: Expense & Income Tracker Logic
   Handles addition, persistence (localStorage), calculations & filtering
   ========================================================================== */

const STORAGE_KEY = "smart_farmer_transactions";

// Load transactions from localStorage or initialize with demoData
function getTransactions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading stored transactions:", e);
    }
  }
  // Fallback to sample data
  return [...demoData.initialTransactions];
}

// Save transactions to localStorage
function saveTransactions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Current filter state: 'all' | 'income' | 'expense'
let currentTrackerFilter = "all";

// Calculate Totals: Income, Expense, Profit
function calculateTrackerTotals(list) {
  let totalIncome = 0;
  let totalExpense = 0;

  list.forEach(item => {
    const amt = Number(item.amount) || 0;
    if (item.type === "income") {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }
  });

  const netProfit = totalIncome - totalExpense;

  return { totalIncome, totalExpense, netProfit };
}

// Render the summary cards and table
function renderTrackerUI() {
  const allTx = getTransactions();
  const lang = window.currentLanguage || "en";
  const { totalIncome, totalExpense, netProfit } = calculateTrackerTotals(allTx);

  // Update Tracker Module Summary Cards
  const incomeElem = document.getElementById("tracker-total-income");
  const expenseElem = document.getElementById("tracker-total-expense");
  const profitElem = document.getElementById("tracker-net-profit");

  if (incomeElem) incomeElem.textContent = `₹ ${totalIncome.toLocaleString("en-IN")}`;
  if (expenseElem) expenseElem.textContent = `₹ ${totalExpense.toLocaleString("en-IN")}`;
  if (profitElem) {
    profitElem.textContent = `₹ ${netProfit.toLocaleString("en-IN")}`;
    profitElem.style.color = netProfit >= 0 ? "var(--primary-dark)" : "var(--danger-red)";
  }

  // Update Dashboard KPI cards
  const dashIncome = document.getElementById("dash-kpi-income");
  const dashExpense = document.getElementById("dash-kpi-expense");
  const dashProfit = document.getElementById("dash-kpi-profit");
  const dashCrops = document.getElementById("dash-kpi-crops");
  const dashTasks = document.getElementById("dash-kpi-tasks");

  if (dashIncome) dashIncome.textContent = `₹ ${totalIncome.toLocaleString("en-IN")}`;
  if (dashExpense) dashExpense.textContent = `₹ ${totalExpense.toLocaleString("en-IN")}`;
  if (dashProfit) {
    dashProfit.textContent = `₹ ${netProfit.toLocaleString("en-IN")}`;
    dashProfit.style.color = netProfit >= 0 ? "var(--primary-dark)" : "var(--danger-red)";
  }
  if (dashCrops && window.demoData && demoData.cropsEncyclopedia) {
    dashCrops.textContent = demoData.cropsEncyclopedia.length;
  }
  if (dashTasks) {
    dashTasks.textContent = "3";
  }

  // Render recent 3 transactions snippet on dashboard
  const recentSnippet = document.getElementById("dash-recent-tx-list");
  if (recentSnippet) {
    recentSnippet.innerHTML = "";
    const sortedTx = [...allTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    if (sortedTx.length === 0) {
      recentSnippet.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 12px;">${translations[lang].noRecords}</p>`;
    } else {
      sortedTx.forEach(item => {
        const isIncome = item.type === "income";
        const catName = translations[lang][item.categoryKey] || item.categoryKey;
        const div = document.createElement("div");
        div.className = "dash-tx-item";
        div.innerHTML = `
          <div class="dash-tx-item-left">
            <span style="font-size: 1.25rem;">${isIncome ? "🌱" : "💸"}</span>
            <div>
              <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(item.description || catName)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${item.date} • ${catName}</div>
            </div>
          </div>
          <div class="${isIncome ? 'dash-tx-amount-green' : 'dash-tx-amount-red'}">
            ${isIncome ? "+ " : "- "}₹ ${Number(item.amount).toLocaleString("en-IN")}
          </div>
        `;
        recentSnippet.appendChild(div);
      });
    }
  }

  // Filter records
  const filtered = allTx.filter(item => {
    if (currentTrackerFilter === "all") return true;
    return item.type === currentTrackerFilter;
  });

  // Render Table Rows
  const tbody = document.getElementById("tracker-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
        ${translations[lang].noRecords}
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  filtered.forEach(tx => {
    const tr = document.createElement("tr");
    const isIncome = tx.type === "income";
    const typeLabel = isIncome ? translations[lang].typeIncome : translations[lang].typeExpense;
    const badgeClass = isIncome ? "badge-success" : "badge-danger";
    const categoryName = translations[lang][tx.categoryKey] || tx.categoryKey;

    tr.innerHTML = `
      <td><span class="badge ${badgeClass}">${isIncome ? "▲ " : "▼ "}${typeLabel.split(" ")[0]}</span></td>
      <td><strong>${categoryName}</strong></td>
      <td>${escapeHtml(tx.description || "-")}</td>
      <td>${tx.date || "-"}</td>
      <td style="font-weight: 700; color: ${isIncome ? "var(--primary-green)" : "var(--danger-red)"};">
        ${isIncome ? "+ " : "- "}₹ ${Number(tx.amount).toLocaleString("en-IN")}
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteTransaction('${tx.id}')" title="Delete">
          🗑️ ${translations[lang].deleteBtn}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Helper: Escape HTML to prevent accidental injection
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Add a new transaction from form
function handleAddTransaction(event) {
  event.preventDefault();
  const lang = window.currentLanguage || "en";

  const type = document.getElementById("tx-type").value;
  const categoryKey = document.getElementById("tx-category").value;
  const amount = parseFloat(document.getElementById("tx-amount").value);
  const date = document.getElementById("tx-date").value;
  const description = document.getElementById("tx-desc").value.trim();

  if (isNaN(amount) || amount <= 0) {
    alert(lang === "mr" ? "कृपया योग्य रक्कम टाका." : (lang === "hi" ? "कृपया सही राशि दर्ज करें।" : "Please enter a valid amount."));
    return;
  }

  const newTx = {
    id: "tx-" + Date.now(),
    type,
    categoryKey,
    amount,
    date: date || new Date().toISOString().split("T")[0],
    description
  };

  const list = getTransactions();
  list.unshift(newTx);
  saveTransactions(list);

  // Clear form
  document.getElementById("tx-amount").value = "";
  document.getElementById("tx-desc").value = "";

  renderTrackerUI();

  // Show Toast
  const toastMsg = lang === "mr" ? "नोंद यशस्वीरित्या जतन केली!" : (lang === "hi" ? "रिकॉर्ड सफलतापूर्वक सहेजा गया!" : "Record added successfully!");
  showToast(toastMsg);
}

// Delete a transaction
function deleteTransaction(id) {
  const lang = window.currentLanguage || "en";
  const confirmMsg = lang === "mr" ? "तुम्हाला ही नोंद खरोखर हटवायची आहे का?" : (lang === "hi" ? "क्या आप वाकई यह रिकॉर्ड हटाना चाहते हैं?" : "Are you sure you want to delete this record?");

  if (confirm(confirmMsg)) {
    let list = getTransactions();
    list = list.filter(item => item.id !== id);
    saveTransactions(list);
    renderTrackerUI();

    const toastMsg = lang === "mr" ? "नोंद हटवली आहे." : (lang === "hi" ? "रिकॉर्ड हटा दिया गया है।" : "Record deleted.");
    showToast(toastMsg);
  }
}

// Reset to Sample Data
function resetTrackerToSampleData() {
  const lang = window.currentLanguage || "en";
  const confirmMsg = lang === "mr" ? "नमुना माहिती पूर्ववत करायची आहे का? नवीन नोंदी पुसल्या जातील." : (lang === "hi" ? "क्या आप सैंपल डेटा रीसेट करना चाहते हैं?" : "Reset to sample demo records?");

  if (confirm(confirmMsg)) {
    saveTransactions([...demoData.initialTransactions]);
    renderTrackerUI();
    showToast(lang === "mr" ? "नमुना माहिती पूर्ववत केली!" : (lang === "hi" ? "सैंपल डेटा रीसेट हो गया!" : "Sample data restored!"));
  }
}

// Set Filter
function setTrackerFilter(filterType) {
  currentTrackerFilter = filterType;
  
  // Highlight active filter button
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("data-filter") === filterType) {
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-secondary");
    }
  });

  renderTrackerUI();
}

// Initialize Tracker Events
document.addEventListener("DOMContentLoaded", () => {
  const txForm = document.getElementById("add-transaction-form");
  if (txForm) {
    txForm.addEventListener("submit", handleAddTransaction);
  }

  // Pre-fill today's date in form
  const dateInput = document.getElementById("tx-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  renderTrackerUI();
});
