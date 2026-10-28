/**
 * Alex Rivera - Neomorphic Portfolio Interactive Engine
 * 100% Vanilla JavaScript
 * Features:
 *  - Web Audio API Tactile Sound Engine (Self-contained sound synthesizer)
 *  - Dynamic Neomorphic Theme Switcher (Light / Obsidian Dark Mode)
 *  - Project Modal Preview System
 *  - Category Filter Systems (Skills & Projects)
 *  - Animated Number Counters (Intersection Observer)
 *  - Live Tactile System Clock & Interactive Console
 *  - Contact Form Live Validation & Transmit Simulator
 *  - Clipboard Copy Utility & Toast Notification System
 *  - Mobile Drawer Navigation & Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API SYNTHETIC SOUND ENGINE (Tactile Acoustic Clicks)
  // =========================================================================
  class TactileAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.enabled = localStorage.getItem('neo-sound-enabled') !== 'false';
      this.pulseEl = document.getElementById('audio-pulse');
      this.initToggleButton();
    }

    getAudioContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    playClick(type = 'soft') {
      if (!this.enabled) return;

      const ctx = this.getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'tick') {
          // Sharp tactile tick for switches / tabs
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'pop') {
          // Soft organic rubber bubble pop
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.start(now);
          osc.stop(now + 0.055);
        } else {
          // Standard tactile button press
          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.start(now);
          osc.stop(now + 0.05);
        }

        // Tiny visual pulse indicator
        if (this.pulseEl) {
          this.pulseEl.classList.add('firing');
          setTimeout(() => this.pulseEl.classList.remove('firing'), 120);
        }
      } catch (err) {
        // Audio playback gracefully suppressed if browser policies block it
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('neo-sound-enabled', this.enabled);
      this.updateUI();
      if (this.enabled) {
        this.playClick('tick');
        showToast('Tactile audio feedback enabled 🔊');
      } else {
        showToast('Tactile audio feedback muted 🔇');
      }
    }

    initToggleButton() {
      const btn = document.getElementById('sound-toggle-btn');
      if (!btn) return;

      this.updateUI();

      btn.addEventListener('click', () => {
        this.toggle();
      });
    }

    updateUI() {
      const btn = document.getElementById('sound-toggle-btn');
      if (!btn) return;

      const soundOn = btn.querySelector('.sound-on-icon');
      const soundOff = btn.querySelector('.sound-off-icon');

      if (this.enabled) {
        btn.classList.add('active-pressed');
        btn.setAttribute('title', 'Tactile Sound Feedback (On)');
        if (soundOn) soundOn.style.display = 'block';
        if (soundOff) soundOff.style.display = 'none';
      } else {
        btn.classList.remove('active-pressed');
        btn.setAttribute('title', 'Tactile Sound Feedback (Off)');
        if (soundOn) soundOn.style.display = 'none';
        if (soundOff) soundOff.style.display = 'block';
      }
    }
  }

  const soundEngine = new TactileAudioEngine();

  // Attach tactile sound to all neomorphic buttons
  document.querySelectorAll('.neo-btn, .neo-icon-btn, .neo-tab-btn, .neo-social-btn, .nav-logo').forEach(el => {
    el.addEventListener('click', () => soundEngine.playClick('pop'));
  });

  // =========================================================================
  // 2. THEME SWITCHER (Light Neomorphic vs Obsidian Dark)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-sun-icon') : null;
  const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-moon-icon') : null;

  function getPreferredTheme() {
    return localStorage.getItem('neo-theme') || 'light';
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neo-theme', theme);

    if (theme === 'dark') {
      // In dark mode, show sun icon to allow switching to light mode
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Soft Light Mode');
    } else {
      // In light mode, show moon icon to allow switching to dark mode
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Obsidian Dark Mode');
    }
  }

  // Enforce light theme on load
  applyTheme('light');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      soundEngine.playClick('tick');
      const current = document.body.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Obsidian Dark' : 'Soft Slate Light'} Mode`);
    });
  }

  // =========================================================================
  // 3. LIVE CONSOLE CLOCK & TURBO MODE
  // =========================================================================
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hrs}:${mins}:${secs}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  const turboToggle = document.getElementById('turbo-mode-toggle');
  if (turboToggle) {
    turboToggle.addEventListener('change', (e) => {
      soundEngine.playClick('tick');
      if (e.target.checked) {
        showToast('Turbo Engineering Mode Engaged ⚡ 60 FPS');
      } else {
        showToast('Standard Eco Mode Enabled 🍃');
      }
    });
  }

  // =========================================================================
  // 4. ANIMATED METRICS COUNTERS (Intersection Observer)
  // =========================================================================
  const metricValues = document.querySelectorAll('.metric-value');
  let metricsAnimated = false;

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  function animateCounters() {
    metricValues.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 1500;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(ease * target);

        if (target === 100) {
          el.textContent = `${current}%`;
        } else if (target >= 1000) {
          el.textContent = `${(current / 1000).toFixed(current >= target ? 0 : 1)}k+`;
        } else {
          el.textContent = `${current}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (target === 100) el.textContent = '100%';
          else if (target >= 1000) el.textContent = '15k+';
          else el.textContent = `${target}+`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // =========================================================================
  // 5. SKILLS FILTERING SYSTEM
  // =========================================================================
  const skillTabs = document.querySelectorAll('[data-skill-tab]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      soundEngine.playClick('tick');
      skillTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-skill-tab');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          // Re-trigger bar animation
          const bar = card.querySelector('.neo-progress-bar');
          if (bar) {
            const w = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = w; }, 40);
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 6. PROJECTS FILTERING SYSTEM
  // =========================================================================
  const projectTabs = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      soundEngine.playClick('tick');
      projectTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 7. PROJECT DETAILS MODAL SYSTEM
  // =========================================================================
  const projectsData = {
    '1': {
      title: 'V.A.U.L.T (Virtual Academic Underground Learning Team)',
      category: 'Real-Time Multiplayer Educational Platform',
      image: 'assets/vault.jpg',
      demoUrl: 'https://virtualacademic.vercel.app',
      desc: 'Built V.A.U.L.T, a real-time multiplayer educational platform where squads of up to 4 solve cross-subject puzzles (CS, math and physics, science, ciphers) in co-op "heist" missions. Designed four role-specific player views with asymmetric clues, so each player depends on teammates, plus a timed alarm system that penalises wrong inputs. Developed with React, Vite, Tailwind CSS, Socket.io, Express and PostgreSQL; deployed the frontend on Vercel and the server on Render.',
      tags: ['React', 'Vite', 'Tailwind CSS', 'Socket.io', 'Express', 'PostgreSQL', 'Vercel', 'Render'],
      metrics: [
        { label: 'Co-op Squad Size', val: '4 Players' },
        { label: 'Real-Time Sync', val: 'Socket.io' },
        { label: 'Live Deployment', val: 'Vercel + Render' }
      ]
    },
    '2': {
      title: 'Algorithmic Problem Solving & C++ DSA Repository',
      category: 'Competitive Programming & DSA',
      image: 'assets/dsa_project.jpg',
      demoUrl: 'https://leetcode.com',
      desc: 'Comprehensive algorithmic problem-solving repository with 230+ verified solutions on LeetCode implemented in C++. Spans fundamental and advanced computer science data structures: Binary Search Trees, Graphs, Dynamic Programming, Two Pointers, and Greedy Algorithms with optimal time and space complexity. Earned the prestigious 50 Days Badge 2026.',
      tags: ['C++', 'Algorithms', 'Data Structures', 'LeetCode', '50-Day Badge', 'STL'],
      metrics: [
        { label: 'Problems Solved', val: '230+' },
        { label: 'LeetCode Badge', val: '50 Days 2026' },
        { label: 'Core Language', val: 'C++' }
      ]
    },
    '3': {
      title: 'Smart India Hackathon & Build with Bharat 2.0 Platform',
      category: 'Hackathon Innovation (Team "The Red")',
      image: 'assets/hackathon_project.jpg',
      demoUrl: 'https://github.com',
      desc: 'Collaborative student education innovation and analytics dashboard built with team "The Red". Semifinalist at the Build with Bharat 2.0 national hackathon, and ranked among the top 45 teams out of 444 competing teams in the Smart India Hackathon internal college selection round (Smart Education theme).',
      tags: ['Hackathon', 'Team "The Red"', 'Smart Education', 'React', 'Node.js', 'Express', 'Tailwind CSS'],
      metrics: [
        { label: 'SIH Rank', val: 'Top 45 / 444' },
        { label: 'Build with Bharat', val: 'Semifinalist' },
        { label: 'Domain', val: 'Smart Education' }
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const previewModalBtns = document.querySelectorAll('.preview-modal-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    soundEngine.playClick('pop');

    document.getElementById('modal-project-badge').textContent = data.category;
    document.getElementById('modal-project-title').textContent = data.title;
    document.getElementById('modal-project-desc').textContent = data.desc;

    const imgEl = document.getElementById('modal-project-img');
    imgEl.src = data.image;
    imgEl.alt = data.title;

    // Tags
    const tagsContainer = document.getElementById('modal-project-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag-pill neo-inset';
      span.textContent = t;
      tagsContainer.appendChild(span);
    });

    // Metrics
    const metricsContainer = document.getElementById('modal-project-metrics');
    metricsContainer.innerHTML = '';
    data.metrics.forEach(m => {
      const item = document.createElement('div');
      item.className = 'metric-item';
      item.innerHTML = `<span class="metric-num">${m.val}</span><span class="metric-name">${m.label}</span>`;
      metricsContainer.appendChild(item);
    });

    // Modal Live Preview Link
    const demoLink = document.getElementById('modal-demo-link');
    if (demoLink) {
      demoLink.href = data.demoUrl || '#';
      if (data.demoUrl) {
        demoLink.style.display = 'inline-flex';
      } else {
        demoLink.style.display = 'none';
      }
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    soundEngine.playClick('pop');
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);

  // Close on backdrop click
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // =========================================================================
  // 8. CLIPBOARD COPY UTILITY & RESUME DOWNLOAD
  // =========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyLabel = document.getElementById('copy-btn-label');
  const emailToCopy = 'arpi85222707@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      soundEngine.playClick('tick');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = emailToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        if (copyLabel) copyLabel.textContent = 'Copied! ✓';
        showToast('Email address copied: arpi85222707@gmail.com 📋');
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = 'Copy';
        }, 3000);
      } catch (err) {
        showToast(`Contact email: ${emailToCopy}`);
      }
    });
  }

  // Download CV simulated action
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      soundEngine.playClick('pop');
      showToast('Generating resume PDF... Ready for review! 📄');
    });
  }

  // =========================================================================
  // 9. CONTACT FORM VALIDATION & TRANSMISSION SIMULATOR
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  if (contactForm) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please provide your name.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email format.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters long.';
        isValid = false;
      }

      if (!isValid) {
        soundEngine.playClick('tick');
        return;
      }

      // Simulate sending state
      soundEngine.playClick('pop');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtnText.textContent = 'Transmitting dispatch...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtnText.textContent = 'Message Transmitted! ✓';

        showToast(`Thank you ${nameInput.value.trim()}! Your message was sent to Arpit. 🚀`);
        contactForm.reset();

        setTimeout(() => {
          submitBtnText.textContent = 'Transmit Message';
        }, 4000);
      }, 1200);
    });
  }

  // =========================================================================
  // 10. SCROLL SPY, BACK TO TOP & MOBILE DRAWER
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 160;
      const sectionId = sec.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-nav') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transition = 'opacity 0.25s';
    backToTopBtn.addEventListener('click', () => {
      soundEngine.playClick('pop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      soundEngine.playClick('tick');
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        soundEngine.playClick('pop');
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 11. TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast neo-raised';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }
});
