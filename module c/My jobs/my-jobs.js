// Accept Offer
function acceptOffer() {
    const message = document.getElementById('acceptMessage');
    message.classList.add('show');
    console.log("Status changed to 'Accepted'");
    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
}

// Decline Offer
function declineOffer() {
    if (confirm('Are you sure you want to decline this offer?')) {
        alert('Offer declined. The client has been notified.');
        console.log("Offer declined");
    }
}