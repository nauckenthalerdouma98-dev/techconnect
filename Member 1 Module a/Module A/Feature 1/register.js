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

// ----- Custom UI helpers -----
function showNotification(message, type = "info", duration = 4000) {
  const container = document.getElementById("notificationContainer");
  if (!container) return;
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);
  setTimeout(() => {
    notif.classList.add("hide");
    notif.addEventListener("animationend", () => notif.remove());
  }, duration);
}

function showLoading() {
  const bar = document.getElementById("loadingBar");
  if (bar) bar.classList.add("show");
}
function hideLoading() {
  const bar = document.getElementById("loadingBar");
  if (bar) bar.classList.remove("show");
}

// ----- State -----
let isFreelancer = true;
let currentStep = 1;
let tempUserCredential = null;

// ----- DOM elements -----
const splitWrapper = document.getElementById("splitWrapper");
const switchRoleBtn = document.getElementById("switchRoleBtn");
const switchLabel = document.getElementById("switchLabel");
const roleLabel = document.getElementById("roleLabel");
const infoContent = document.getElementById("infoContent");
const step1Form = document.getElementById("step1Form");
const step2Form = document.getElementById("step2Form");
const step1Next = document.getElementById("step1Next");
const step2Back = document.getElementById("step2Back");
const googleRegisterBtn = document.getElementById("googleRegisterBtn");
const checkVerificationBtn = document.getElementById("checkVerificationBtn");
const resendVerificationBtn = document.getElementById("resendVerificationBtn");
const verifyEmailDisplay = document.getElementById("verifyEmailDisplay");
const completeRegistrationBtn = document.getElementById("completeRegistrationBtn");
const verifyPrompt = document.getElementById("verifyPrompt");
const termsSection = document.getElementById("termsSection");

// ----- Skill selector setup (step 2) -----
const skillContainer = document.getElementById("skillSelectorContainer");
SkillSelector.init(skillContainer);

// ----- Info side updater -----
function updateInfoSide(title, desc, icon) {
  infoContent.innerHTML = `
    <div class="info-icon">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon === "freelancer" ? '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>' : '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'}</svg>
    </div>
    <h1 id="infoTitle">${title}</h1>
    <p id="infoDesc">${desc}</p>
  `;
}
updateInfoSide("Register as Freelancer", "Showcase your skills, find clients, and get paid securely through Nkwa Pay escrow.", "freelancer");

// ----- Step navigation -----
function showStep(step) {
  document.querySelectorAll(".step-content").forEach(el => el.classList.add("hidden"));
  document.getElementById(`step${step}Content`).classList.remove("hidden");
  document.querySelectorAll(".step-indicator .step").forEach(el => {
    el.classList.remove("active", "completed");
    if (parseInt(el.dataset.step) === step) el.classList.add("active");
    else if (parseInt(el.dataset.step) < step) el.classList.add("completed");
  });
  currentStep = step;
}

// ----- Role switch (only step 1) -----
switchRoleBtn.addEventListener("click", () => {
  if (currentStep !== 1) return;
  isFreelancer = !isFreelancer;
  splitWrapper.classList.toggle("swapped");
  if (isFreelancer) {
    switchLabel.textContent = "Client";
    roleLabel.textContent = "Freelancer";
    updateInfoSide("Register as Freelancer", "Showcase your skills, find clients, and get paid securely through Nkwa Pay escrow.", "freelancer");
  } else {
    switchLabel.textContent = "Freelancer";
    roleLabel.textContent = "Client";
    updateInfoSide("Register as Client", "Hire vetted talent, pay only when satisfied, and manage projects with milestones.", "client");
  }
});

// ----- Step 1 → Step 2 (email/password) -----
step1Form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  if (!email || !password || password.length < 8) {
    showNotification("Please fill in valid email and password (min 8 characters).", "error");
    return;
  }

  showLoading();
  step1Next.disabled = true;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      tempUserCredential = userCredential;
      return db.collection("users").doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        role: isFreelancer ? "skilled" : "client",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(() => {
      document.getElementById("freelancerFields").classList.toggle("hidden", !isFreelancer);
      document.getElementById("clientFields").classList.toggle("hidden", isFreelancer);
      SkillSelector.setSkills([]);  // reset skills on new registration flow
      showStep(2);
      updateInfoSide(
        isFreelancer ? "Profile details" : "Tell us about you",
        isFreelancer ? "Add your skills and a short bio so clients can find you." : "Help freelancers understand your needs.",
        isFreelancer ? "freelancer" : "client"
      );
    })
    .catch((error) => {
      showNotification("Registration error: " + error.message, "error");
    })
    .finally(() => {
      hideLoading();
      step1Next.disabled = false;
    });
});

// ----- Google Sign‑Up (goes to step 2) -----
googleRegisterBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  showLoading();
  auth.signInWithPopup(provider)
    .then((result) => {
      tempUserCredential = result;
      return db.collection("users").doc(result.user.uid).set({
        name: result.user.displayName || "",
        email: result.user.email,
        role: isFreelancer ? "skilled" : "client",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(() => {
      document.getElementById("freelancerFields").classList.toggle("hidden", !isFreelancer);
      document.getElementById("clientFields").classList.toggle("hidden", isFreelancer);
      SkillSelector.setSkills([]);
      showStep(2);
      updateInfoSide(
        isFreelancer ? "Profile details" : "Tell us about your business",
        isFreelancer ? "Add your skills and a short bio so clients can find you." : "Let freelancers know what kind of projects you have and how to best work with you.",
        isFreelancer ? "freelancer" : "client"
      );
      showNotification("Google account linked successfully!", "success");
    })
    .catch((error) => {
      showNotification("Google sign‑up failed: " + error.message, "error");
    })
    .finally(() => hideLoading());
});

// ----- Step 2 → Step 3 -----
step2Form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!tempUserCredential) return;

  const userId = tempUserCredential.user.uid;
  const fullName = document.getElementById("fullName").value.trim();
  let data = { name: fullName };

  if (isFreelancer) {
    data.bio = document.getElementById("bio").value.trim();
    data.skills = SkillSelector.getSkills();  // get skills from reusable component

    const fileInput = document.getElementById("profilePicture");
    const file = fileInput.files[0];

    showLoading();

    db.collection("users").doc(userId).update(data)
      .then(() => {
        if (file) {
          const storageRef = storage.ref(`profile/${userId}/${file.name}`);
          storageRef.put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => db.collection("users").doc(userId).update({ profileImageURL: url }))
            .catch(() => {
              showNotification("Profile picture upload failed – you can add it later.", "error");
            });
        }
      })
      .then(() => {
        tempUserCredential.user.sendEmailVerification()
          .then(() => {
            verifyEmailDisplay.textContent = tempUserCredential.user.email;
            verifyPrompt.classList.remove("hidden");
            termsSection.classList.add("hidden");
            showStep(3);
            updateInfoSide("Verify your email", "Check your inbox and click the link we sent you.", isFreelancer ? "freelancer" : "client");
          })
          .catch(() => {
            showNotification("Error sending verification email.", "error");
          });
      })
      .catch(err => showNotification("Error saving profile: " + err.message, "error"))
      .finally(() => hideLoading());
  } else {
    // Client
    data.companyName = document.getElementById("companyName").value.trim();
    data.clientBio = document.getElementById("clientBio").value.trim();

    showLoading();
    db.collection("users").doc(userId).update(data)
      .then(() => {
        tempUserCredential.user.sendEmailVerification()
          .then(() => {
            verifyEmailDisplay.textContent = tempUserCredential.user.email;
            verifyPrompt.classList.remove("hidden");
            termsSection.classList.add("hidden");
            showStep(3);
            updateInfoSide("Verify your email", "Check your inbox and click the link we sent you.", "client");
          });
      })
      .catch(err => showNotification("Error saving profile: " + err.message, "error"))
      .finally(() => hideLoading());
  }
});

step2Back.addEventListener("click", () => {
  showStep(1);
  updateInfoSide(
    isFreelancer ? "Register as Freelancer" : "Register as Client",
    isFreelancer ? "Showcase your skills, find clients, and get paid securely through Nkwa Pay escrow." : "Hire vetted talent, pay only when satisfied, and manage projects with milestones.",
    isFreelancer ? "freelancer" : "client"
  );
});

// ----- Step 3 logic -----
checkVerificationBtn.addEventListener("click", () => {
  auth.currentUser.reload().then(() => {
    if (auth.currentUser.emailVerified) {
      verifyPrompt.classList.add("hidden");
      termsSection.classList.remove("hidden");
    } else {
      showNotification("Email not yet verified. Check your inbox and click Resend if needed.", "info");
    }
  });
});

resendVerificationBtn.addEventListener("click", () => {
  auth.currentUser.sendEmailVerification()
    .then(() => showNotification("Verification email resent.", "info"));
});

completeRegistrationBtn.addEventListener("click", () => {
  const acceptTerms = document.getElementById("acceptTerms").checked;
  const acceptPrivacy = document.getElementById("acceptPrivacy").checked;
  if (!acceptTerms || !acceptPrivacy) {
    showNotification("Please accept both Terms of Service and Privacy Policy.", "error");
    return;
  }

  showLoading();
  db.collection("users").doc(auth.currentUser.uid).update({ termsAccepted: true })
    .then(() => {
      showNotification("Registration complete! Redirecting…", "success");
      setTimeout(() => (window.location.href = "../Feature 3/Profile.html"), 1500);
    })
    .catch(err => showNotification("Error finalizing: " + err.message, "error"))
    .finally(() => hideLoading());
});

// ----- Password toggle -----
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    btn.querySelector("svg").innerHTML = type === "password"
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  });
});