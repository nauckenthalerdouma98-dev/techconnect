// Budget display update based on selection (mock data)
document.getElementById('jobSelect').addEventListener('change', function () {
    const budgets = {
        'project1': 100000,
        'project2': 150000,
        'project3': 200000,
        'project4': 75000
    };
    const amount = budgets[this.value] || 0;
    document.getElementById('budgetDisplay').textContent = amount.toLocaleString();
    const offerPriceInput = document.getElementById('offerPrice');
    offerPriceInput.value = amount || '';
});

// Offer price input update to budget display
document.getElementById('offerPrice').addEventListener('input', function () {
    const priceValue = this.value ? Number(this.value).toLocaleString() : '0';
    document.getElementById('budgetDisplay').textContent = priceValue;
});

// Send Offer Form
document.getElementById('offerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedJob = document.getElementById('jobSelect').value;
    const offerPrice = document.getElementById('offerPrice').value;
    const offerNote = document.getElementById('offerNote').value;

    // Get selected project name
    const jobSelect = document.getElementById('jobSelect');
    const projectName = jobSelect.options[jobSelect.selectedIndex].text;

    // Create offer object with revision tracking
    const offer = {
        id: Date.now(),
        projectId: selectedJob,
        projectName: projectName,
        price: parseInt(offerPrice),
        note: offerNote,
        status: 'pending',
        revisionCount: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours from now
    };

    // Save to localStorage
    const offers = JSON.parse(localStorage.getItem('pendingOffers') || '[]');
    offers.push(offer);
    localStorage.setItem('pendingOffers', JSON.stringify(offers));

    console.log(`Offer Sent for ${selectedJob} at ${offerPrice} FCFA. Status updated to 'Created'. Notification triggered. Revision Count: 0`);

    const message = document.getElementById('offerMessage');
    message.classList.add('show');
    this.reset();
    document.getElementById('budgetDisplay').textContent = '0';
    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
});
