// script.js – mobile menu, dark mode, scroll animations

(function() {
  'use strict';

  // ----- elements -----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const darkToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // ----- mobile menu toggle -----
  const toggleMenu = () => {
    navMenu.classList.toggle('active');
    // animate hamburger bars (optional)
    hamburger.classList.toggle('active');
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // only close if mobile menu is active
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
      // smooth scrolling already handled by CSS, but we ensure no interference
    });
  });

  // close menu on window resize if width > 768
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // ----- dark mode toggle (with local storage) -----
  const DARK_KEY = 'eduBlogDarkMode';
  // check stored preference
  const storedDark = localStorage.getItem(DARK_KEY);
  if (storedDark === 'true') {
    body.classList.add('dark-mode');
    updateDarkIcon(true);
  }

  function updateDarkIcon(isDark) {
    const icon = darkToggle.querySelector('i');
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem(DARK_KEY, isDark);
    updateDarkIcon(isDark);
  });

  // initial icon
  updateDarkIcon(body.classList.contains('dark-mode'));

  // ----- fade on scroll (Intersection Observer) -----
  const fadeElements = document.querySelectorAll('.fade-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // optional: unobserve after animation to save resources
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  // manually reveal elements that might already be visible on load
  // (observer will handle, but we can force check)
  window.addEventListener('load', () => {
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  });

  // ----- smooth scrolling for any anchor with hash (fallback) -----
  // CSS already uses scroll-behavior:smooth, but we ensure mobile menu closes
  // also for external # links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === "#" || href === "") return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // if mobile menu open, close after slight delay
        if (navMenu.classList.contains('active')) {
          closeMenu();
        }
        // no preventDefault needed because scroll-behavior handles it.
        // but we can manually scroll for better cross-browser?
        // keep default for smooth css.
      }
    });
  });

  // small hamburger animation (optional)
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .hamburger.active .bar:nth-child(2) { opacity: 0; }
    .hamburger.active .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
  `;
  document.head.appendChild(style);

  // force dark mode icon sync after style injection? already done.

})();

// IMAGE PREVIEW GLOBAL
const images = document.querySelectorAll('.preview-img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.image-modal .close');

images.forEach(img => {
  img.style.cursor = "pointer"; // biar keliatan clickable

  img.addEventListener('click', () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = function() {
  modal.style.display = "none";
}

modal.onclick = function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
}