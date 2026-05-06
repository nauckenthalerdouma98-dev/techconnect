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
const db = firebase.firestore();
const storage = firebase.storage();

// ----- Custom UI helpers (consistent with other modules) -----
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

function showLoading() {
  const bar = document.getElementById('loadingBar');
  if (bar) bar.classList.add('show');
}
function hideLoading() {
  const bar = document.getElementById('loadingBar');
  if (bar) bar.classList.remove('show');
}

// ----- Auth guard -----
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = '../Feature 2/login.html';
    return;
  }
  loadUserData(user.uid);
});

// ----- Global state -----
let selectedSkills = [];
let currentRole = 'skilled';
document.getElementById('roleLabel').innerHTML = `You are logged in as <strong>${currentRole === 'skilled' ? 'Skilled' : 'Client'}</strong>`;
document.getElementById('signOutLink').addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.href = '../../Index/index.html';
  });
});

// Predefined skills (same as registration)
const predefinedSkills = [
  'Python', 'JavaScript', 'React', 'Node.js', 'UI/UX Design',
  'Logo Design', 'Content Writing', 'Video Editing', 'Social Media',
  'Mobile Development', 'Data Science', 'Graphic Design'
];

// ----- Load user data from Firestore -----
async function loadUserData(uid) {
  try {
    showLoading();
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      showNotification('Profile not found.', 'error');
      hideLoading();
      return;
    }

    const data = doc.data();
    currentRole = data.role || 'skilled';

    // Set avatar and name/email in header
    document.getElementById('displayName').textContent = data.name || 'Your Name';
    document.getElementById('displayEmail').textContent = data.email || '';
    if (data.profileImageURL) {
      document.getElementById('avatarImg').src = data.profileImageURL;
    } else {
      document.getElementById('avatarImg').src = ''; // default placeholder?
    }

    // Populate form fields
    document.getElementById('fullName').value = data.name || '';
    document.getElementById('mobile').value = data.mobile || '';
    document.getElementById('education').value = data.education || '';
    document.getElementById('country').value = data.country || '';
    document.getElementById('state').value = data.state || '';
    document.getElementById('address1').value = data.address1 || '';
    document.getElementById('address2').value = data.address2 || '';
    document.getElementById('bio').value = data.bio || '';

    // Role-based fields
    if (currentRole === 'skilled') {
      document.querySelectorAll('.freelancer-only').forEach(el => el.classList.remove('hidden'));
      document.querySelectorAll('.client-only').forEach(el => el.classList.add('hidden'));
      document.getElementById('experience').value = data.experience || '';
      // Skills
      selectedSkills = data.skills || [];
    } else {
      document.querySelectorAll('.freelancer-only').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.client-only').forEach(el => el.classList.remove('hidden'));
      document.getElementById('companyName').value = data.companyName || '';
      document.getElementById('clientDesc').value = data.clientDesc || '';
    }

    renderSkills();
    hideLoading();
  } catch (error) {
    showNotification('Error loading profile: ' + error.message, 'error');
    hideLoading();
  }
}

// ----- Skill selector logic (reusable) -----
const skillInput = document.getElementById('skillInput');
const skillsDisplay = document.getElementById('skillsDisplay');
const skillSuggestions = document.getElementById('skillSuggestions');

function renderSkills() {
  if (currentRole !== 'skilled') return;
  skillsDisplay.innerHTML = selectedSkills.map(skill =>
    `<span class="skill-chip">${skill} <button type="button" data-skill="${skill}">×</button></span>`
  ).join('');
  skillsDisplay.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSkills = selectedSkills.filter(s => s !== btn.dataset.skill);
      renderSkills();
    });
  });
}

skillInput.addEventListener('input', () => {
  if (currentRole !== 'skilled') return;
  const query = skillInput.value.toLowerCase().trim();
  const filtered = predefinedSkills.filter(s => s.toLowerCase().includes(query) && !selectedSkills.includes(s));
  skillSuggestions.innerHTML = filtered.map(s => `<div>${s}</div>`).join('');
  skillSuggestions.style.display = filtered.length ? 'block' : 'none';
});

skillSuggestions.addEventListener('click', (e) => {
  if (e.target.tagName === 'DIV') {
    const skill = e.target.textContent;
    if (!selectedSkills.includes(skill)) {
      selectedSkills.push(skill);
      renderSkills();
      skillInput.value = '';
      skillSuggestions.style.display = 'none';
    }
  }
});

skillInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const customSkill = skillInput.value.trim();
    if (customSkill && !selectedSkills.includes(customSkill)) {
      selectedSkills.push(customSkill);
      renderSkills();
      skillInput.value = '';
      skillSuggestions.style.display = 'none';
    }
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.skill-selector')) {
    skillSuggestions.style.display = 'none';
  }
});

// ----- Avatar upload preview -----
document.getElementById('profilePictureInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('avatarImg').src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// ----- Save form -----
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  showLoading();

  try {
    const data = {
      name: document.getElementById('fullName').value.trim(),
      mobile: document.getElementById('mobile').value.trim(),
      education: document.getElementById('education').value.trim(),
      country: document.getElementById('country').value.trim(),
      state: document.getElementById('state').value.trim(),
      address1: document.getElementById('address1').value.trim(),
      address2: document.getElementById('address2').value.trim(),
      bio: document.getElementById('bio').value.trim(),
    };

    if (currentRole === 'skilled') {
      data.skills = selectedSkills;
      data.experience = document.getElementById('experience').value.trim();
    } else {
      data.companyName = document.getElementById('companyName').value.trim();
      data.clientDesc = document.getElementById('clientDesc').value.trim();
    }

    // Upload profile picture if changed
    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];
    if (file) {
      const storageRef = storage.ref(`profile/${user.uid}/${file.name}`);
      const snapshot = await storageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();
      data.profileImageURL = url;
    }

    await db.collection('users').doc(user.uid).update(data);

    // Update header display
    document.getElementById('displayName').textContent = data.name;
    if (data.profileImageURL) document.getElementById('avatarImg').src = data.profileImageURL;

    showNotification('Profile updated successfully!', 'success');
  } catch (error) {
    showNotification('Failed to update profile: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
});