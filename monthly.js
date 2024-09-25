const addExpenseBtn = document.getElementById('add-expense');
const weeklyExpenseDetails = document.getElementById('weekly-expense-details');
const selectedMonthElement = document.getElementById('selected-month');
const monthlyList = document.getElementById('monthly-list');

let expenses = [];

function generateMonthButtons() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((month, index) => {
        const monthButton = document.createElement('button');
        monthButton.textContent = month;
        monthButton.addEventListener('click', () => showWeeklyExpenses(index));
        monthlyList.appendChild(monthButton);
    });
}

function getWeekNumber(date) {
    const tempDate = new Date(date);
    const firstDayOfYear = new Date(tempDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (tempDate - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

addExpenseBtn.addEventListener('click', () => {
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (date && category && !isNaN(amount)) {
        expenses.push({ date, category, amount });

        document.getElementById('date').value = '';
        document.getElementById('category').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please fill in all required fields.');
    }
});

function showWeeklyExpenses(monthIndex) {
    weeklyExpenseDetails.innerHTML = '';

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === monthIndex;
    });

    const weeklyExpenses = {};
    filteredExpenses.forEach(expense => {
        const weekNumber = getWeekNumber(expense.date);
        if (!weeklyExpenses[weekNumber]) {
            weeklyExpenses[weekNumber] = [];
        }
        weeklyExpenses[weekNumber].push(expense);
    });

    selectedMonthElement.textContent = `Weekly Expenses for ${new Date(2024, monthIndex).toLocaleString('default', { month: 'long' })}`;
    Object.keys(weeklyExpenses).forEach(week => {
        const weekExpenses = weeklyExpenses[week];
        const totalAmount = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const weekDetail = document.createElement('li');
        weekDetail.textContent = 'Week ${week}: $${totalAmount.toFixed(2)}';
        weeklyExpenseDetails.appendChild(weekDetail);
    });

    if (Object.keys(weeklyExpenses).length === 0) {
        const noExpenseMessage = document.createElement('li');
        noExpenseMessage.textContent = 'No expenses recorded for this month.';
        weeklyExpenseDetails.appendChild(noExpenseMessage);
    }
}

generateMonthButtons();