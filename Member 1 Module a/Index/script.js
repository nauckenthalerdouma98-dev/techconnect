// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

// Search form placeholder alert
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Please log in or create an account to search services.');
  });
}

// Support FAB & panel (only FAQs left)
const fab = document.getElementById('supportFab');
const panel = document.getElementById('supportPanel');
const closeBtn = document.getElementById('supportClose');
if (fab && panel) {
  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
    fab.setAttribute('aria-expanded', panel.classList.contains('open'));
  });
  closeBtn?.addEventListener('click', () => {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', false);
  });
  document.addEventListener('click', (event) => {
    if (!panel.contains(event.target) && event.target !== fab) {
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded', false);
    }
  });
}

// Scroll‑reveal for steps (minimal animation)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});