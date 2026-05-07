// Load and display pending offers
function loadPendingOffers() {
    const offersContainer = document.getElementById('offers');
    const offers = JSON.parse(localStorage.getItem('pendingOffers') || '[]');

    // Clear existing offers
    offersContainer.innerHTML = '';

    if (offers.length === 0) {
        offersContainer.innerHTML = `
            <div class="offer-card" style="text-align: center; color: #666;">
                <p>No pending offers at the moment.</p>
                <p>Offers you send will appear here automatically.</p>
            </div>
        `;
        return;
    }

    // Display each offer
    offers.forEach(offer => {
        const expiresAt = new Date(offer.expiresAt);
        const now = new Date();
        const timeLeft = expiresAt - now;
        const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

        const offerCard = document.createElement('div');
        offerCard.className = 'offer-card';
        offerCard.innerHTML = `
            <h4>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Project">
                    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                    <line x1="12" y1="12" x2="20" y2="7.5"></line>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <line x1="12" y1="12" x2="4" y2="7.5"></line>
                </svg>
                ${offer.projectName}
            </h4>
            <p>${offer.note}</p>
            <p class="budget-highlight">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Budget">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Budget: ${offer.price.toLocaleString()} FCFA
            </p>
            <p style="color: #999; font-size: 0.9rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Time">
                    <circle cx="12" cy="12" r="9"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Expires in ${hoursLeft} hours
            </p>
            <div class="btn-group">
                <button class="btn btn-success" onclick="acceptOffer(${offer.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-label="Accept">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Accept Offer
                </button>
                <button class="btn btn-secondary" onclick="declineOffer(${offer.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-label="Decline">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Decline
                </button>
            </div>
        `;
        offersContainer.appendChild(offerCard);
    });
}

// Accept Offer
function acceptOffer(offerId) {
    const offers = JSON.parse(localStorage.getItem('pendingOffers') || '[]');
    const offerIndex = offers.findIndex(offer => offer.id === offerId);

    if (offerIndex !== -1) {
        offers[offerIndex].status = 'accepted';
        localStorage.setItem('pendingOffers', JSON.stringify(offers));

        const message = document.getElementById('acceptMessage');
        message.classList.add('show');
        console.log("Status changed to 'Accepted'");
        setTimeout(() => {
            message.classList.remove('show');
            loadPendingOffers(); // Refresh the offers list
        }, 5000);
    }
}

// Decline Offer
function declineOffer(offerId) {
    if (confirm('Are you sure you want to decline this offer?')) {
        const offers = JSON.parse(localStorage.getItem('pendingOffers') || '[]');
        const updatedOffers = offers.filter(offer => offer.id !== offerId);
        localStorage.setItem('pendingOffers', JSON.stringify(updatedOffers));

        alert('Offer declined. The client has been notified.');
        console.log("Offer declined");
        loadPendingOffers(); // Refresh the offers list
    }
}

// Load offers when page loads
document.addEventListener('DOMContentLoaded', loadPendingOffers);