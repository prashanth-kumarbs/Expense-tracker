
const expenseForm = document.getElementById("expense-form");
const expenseBody = document.getElementById("expense-body");
const summaryDiv = document.getElementById("summary");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  expenseBody.innerHTML = "";

  expenses.forEach((exp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${exp.title}</td>
      <td>${exp.category}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td>
        <button class="action-btn edit" onclick="editExpense(${index})">Edit</button>
        <button class="action-btn delete" onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;

    expenseBody.appendChild(row);
  });

  renderSummary();
}

function renderSummary() {
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categorySummary = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = { count: 0, total: 0 };
    acc[exp.category].count++;
    acc[exp.category].total += exp.amount;
    return acc;
  }, {});

  let html = `<p><strong>Total Expenses:</strong> ${totalExpenses}</p>
              <p><strong>Total Amount Spent:</strong> ₹${totalAmount}</p>
              <hr><h3>Category Breakdown:</h3>`;

  for (let category in categorySummary) {
    const { count, total } = categorySummary[category];
    html += `<p>${category}: ${count} items, ₹${total}</p>`;
  }

  summaryDiv.innerHTML = html;
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  if (!title || !category || !amount || !date) {
    alert("Please fill all fields!");
    return;
  }

  expenses.push({ title, category, amount, date });
  saveExpenses();
  renderExpenses();
  expenseForm.reset();
});

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("title").value = exp.title;
  document.getElementById("category").value = exp.category;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("date").value = exp.date;

  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
  }
}

renderExpenses();
