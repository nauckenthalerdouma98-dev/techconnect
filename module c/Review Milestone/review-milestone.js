function review(status) {
    const comment = document.getElementById('comment').value;

    if (status === 'Request Changes') {
        if (!comment) {
            alert("⚠️ Comment is mandatory when requesting changes!");
            return;
        }
        revisionCount++;
        if (revisionCount > 3) {
            alert("❌ Revision limit reached (3/3). Please contact admin for further action.");
            return;
        }
        document.getElementById('revCount').innerText = revisionCount;
    }

    console.log(`Status updated: ${status}`);
    if (status === 'Approve') {
        const message = document.getElementById('reviewMessage');
        message.classList.add('show');
        document.getElementById('comment').value = '';

        setTimeout(() => {
            message.classList.remove('show');
        }, 5000);
    }
}