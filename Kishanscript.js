const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');

let transactions = [];

function loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
        updateUI();
    }
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (description === '' || isNaN(amount) || amount === 0) {
        alert('Please select a valid category and enter a valid amount.');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    saveTransactions();
    updateUI();
    transactionForm.reset();
});

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function formatRupees(amount) {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).replace('₹', '₹ ');
}

function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
}

function updateUI() {
    transactionList.innerHTML = '';

    const transactionsByDate = groupByDate(transactions);

    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceElement.textContent = formatRupees(balance);

    Object.keys(transactionsByDate).forEach(date => {
        const dateGroup = document.createElement('div');
        dateGroup.classList.add('date-group');

        const dateHeader = document.createElement('h3');
        dateHeader.textContent = date;
        dateGroup.appendChild(dateHeader);

        const transactionItems = transactionsByDate[date];
        transactionItems.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.classList.add(transaction.amount > 0 ? 'income' : 'expense');
            listItem.innerHTML = `
                ${transaction.description} 
                <span class="${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}${formatRupees(transaction.amount)}
                </span>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
            `;
            dateGroup.appendChild(listItem);
        });

        transactionList.appendChild(dateGroup);
    });
}

function groupByDate(transactions) {
    return transactions.reduce((acc, transaction) => {
        const date = formatDate(transaction.date);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    updateUI();
}

const clearAllBtn = document.getElementById('clear-all');
clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all transactions?')) {
        transactions = [];
        saveTransactions();
        updateUI();
    }
});

loadTransactions();
