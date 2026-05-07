// Budget display update based on selection (mock data)
document.getElementById('jobSelect').addEventListener('change', function () {
    const budgets = {
        'project1': '100,000',
        'project2': '150,000',
        'project3': '200,000',
        'project4': '75,000'
    };
    const amount = budgets[this.value] || '0';
    document.getElementById('budgetDisplay').textContent = amount;
});

// Send Offer Form
document.getElementById('offerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("Offer Sent. Status updated to 'Created'. Notification triggered.");
    const message = document.getElementById('offerMessage');
    message.classList.add('show');
    this.reset();
    document.getElementById('budgetDisplay').textContent = '0';
    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
});