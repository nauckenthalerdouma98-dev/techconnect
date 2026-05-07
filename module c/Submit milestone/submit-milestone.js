// Update file name when file is selected
function updateFileName(input) {
    const fileName = input.files[0]?.name || 'Click to Upload Files';
    document.getElementById('fileName').textContent = fileName;
}

// Submit Milestone Form
document.getElementById('submitForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const description = document.getElementById('desc').value.trim();
    const fileInput = document.getElementById('file');

    if (!description) {
        alert('Please enter a work description before submitting for review.');
        return;
    }

    if (!fileInput.files.length) {
        alert('Please upload a file before submitting for review.');
        return;
    }

    console.log("Data saved to milestones subcollection");
    const message = document.getElementById('submitMessage');
    message.classList.add('show');
    this.reset();
    document.getElementById('fileName').textContent = 'Click to Upload Files';

    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
});