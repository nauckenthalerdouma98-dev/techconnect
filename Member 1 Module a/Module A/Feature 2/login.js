// Firebase init
const firebaseConfig = {
  apiKey: "AIzaSyC0vvCEOAsPIevk6O0C9DgyigFLSlbvCSI",
  authDomain: "techconnect-e09b5.firebaseapp.com",
  projectId: "techconnect-e09b5",
  storageBucket: "techconnect-e09b5.firebasestorage.app",
  messagingSenderId: "768554488751",
  appId: "1:768554488751:web:7d0d56461ee1b9a1e2d55a"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function showNotification(message, type = 'info', duration = 4000) {
  const container = document.getElementById('notificationContainer');
  if (!container) return;
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);
  setTimeout(() => {
    notif.classList.add('hide');
    notif.addEventListener('animationend', () => notif.remove());
  }, duration);
}

const loginForm = document.getElementById('loginForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const loginBtn = document.getElementById('loginBtn');
const forgotLink = document.getElementById('forgotPasswordLink');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

togglePasswordBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    btn.querySelector('svg').innerHTML = type === 'password'
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) {
    showNotification('Please enter your email and password.', 'error');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.querySelector('.btn-text').style.display = 'none';
  loginBtn.querySelector('.spinner').hidden = false;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showNotification('Login successful!', 'success');
      setTimeout(() => window.location.href = '../Feature 3/Profile.html', 1000);
    })
    .catch((error) => {
      showNotification('Login failed: ' + error.message, 'error');
      loginBtn.disabled = false;
      loginBtn.querySelector('.btn-text').style.display = '';
      loginBtn.querySelector('.spinner').hidden = true;
    });
});

googleLoginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      showNotification('Login successful!', 'success');
      setTimeout(() => window.location.href = '../Feature 3/Profile.html', 1000);
    })
    .catch((error) => {
      showNotification('Google login failed: ' + error.message, 'error');
    });
});

forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showNotification('Please enter your email address first.', 'info');
    return;
  }
  auth.sendPasswordResetEmail(email)
    .then(() => showNotification('Password reset email sent! Check your inbox.', 'success'))
    .catch((error) => showNotification('Error: ' + error.message, 'error'));
});