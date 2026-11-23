/**
 * APNA FPS UNLOCKER - High-Performance 120 FPS Animation Engine
 * Zero-Lag, GPU Accelerated, Cross-Platform (Android & Windows)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. BULLETPROOF THEME ENGINE
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Light';
      localStorage.setItem('apna-fps-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Dark';
      localStorage.setItem('apna-fps-theme', 'dark');
    }
  };

  const savedTheme = localStorage.getItem('apna-fps-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  // ==========================================
  // 2. ZERO-LAG HARDWARE SCROLL REVEAL OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve immediately to free memory & maintain 120 FPS scroll
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 3. STATS NUMBER COUNTER (Smooth Eased Animation)
  // ==========================================
  const counterElements = document.querySelectorAll('.counter-val');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 1400; // ms
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        if (isDecimal) {
          counter.textContent = prefix + current.toFixed(1) + suffix;
        } else {
          counter.textContent = prefix + Math.floor(current).toLocaleString('en-US') + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          if (isDecimal) {
            counter.textContent = prefix + target.toFixed(1) + suffix;
          } else {
            counter.textContent = prefix + target.toLocaleString('en-US') + suffix;
          }
        }
      }
      requestAnimationFrame(updateNumber);
    });
  };

  const statsSection = document.getElementById('statsContainer');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  } else {
    startCounters();
  }

  // ==========================================
  // 4. INTERACTIVE 3D PERSPECTIVE TILT (Desktop Only)
  // ==========================================
  const heroDevice = document.getElementById('heroDeviceFrame');
  const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (heroDevice && isPointerDevice) {
    let tiltRaf = null;

    heroDevice.addEventListener('mousemove', (e) => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        const rect = heroDevice.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        heroDevice.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });

    heroDevice.addEventListener('mouseleave', () => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      heroDevice.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================
  // 5. INTERACTIVE FPS SIMULATOR (60/90/120/144/165 FPS)
  // ==========================================
  const fpsButtons = document.querySelectorAll('.sim-btn');
  const simBall = document.getElementById('simBall');
  const fpsDisplay = document.getElementById('fpsDisplay');
  const msDisplay = document.getElementById('msDisplay');
  const smoothnessBadge = document.getElementById('smoothnessBadge');

  let currentFps = 120;
  let animDirection = 1;
  let currentPos = 0;
  let lastTimestamp = 0;
  let intervalTime = 1000 / 120;

  const fpsData = {
    60: { ms: '16.7', label: 'Standard 60 FPS (Noticeable Stutter in Fights)' },
    90: { ms: '11.1', label: 'Smooth 90 FPS (Competitive Standard)' },
    120: { ms: '8.3', label: 'Butter-Smooth 120 FPS (Ultra Pro Speed)' },
    144: { ms: '6.9', label: 'Flagship 144 FPS (Ultra Low Latency)' },
    165: { ms: '6.1', label: 'Max 165 FPS (Peak Hardware Performance)' }
  };

  function animateBall(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;

    if (elapsed >= intervalTime) {
      lastTimestamp = timestamp - (elapsed % intervalTime);
      const track = document.getElementById('simTrack');
      if (track && simBall) {
        const maxPos = track.clientWidth - simBall.clientWidth - 4;
        currentPos += animDirection * (maxPos / (currentFps * 0.8));

        if (currentPos >= maxPos) {
          currentPos = maxPos;
          animDirection = -1;
        } else if (currentPos <= 0) {
          currentPos = 0;
          animDirection = 1;
        }
        simBall.style.transform = `translate3d(${currentPos}px, 0, 0)`;
      }
    }
    requestAnimationFrame(animateBall);
  }
  requestAnimationFrame(animateBall);

  fpsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fpsButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFps = parseInt(btn.getAttribute('data-fps'), 10) || 120;
      intervalTime = 1000 / currentFps;

      if (fpsDisplay) fpsDisplay.textContent = currentFps;
      if (msDisplay) msDisplay.textContent = fpsData[currentFps]?.ms || '8.3';
      if (smoothnessBadge) {
        smoothnessBadge.textContent = fpsData[currentFps]?.label || 'Butter-Smooth 120 FPS';
      }
    });
  });

  // ==========================================
  // 6. SCREENSHOT LIGHTBOX MODAL
  // ==========================================
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const screenshotCards = document.querySelectorAll('.screenshot-trigger');

  if (lightbox && lightboxImg && lightboxClose) {
    screenshotCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const fullSrc = card.getAttribute('data-full') || card.querySelector('img')?.src;
        if (fullSrc) {
          lightboxImg.src = fullSrc;
          lightbox.classList.remove('hidden');
          lightbox.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // 7. DOWNLOAD BUTTON TACTILE MICRO-INTERACTION (Toast)
  // ==========================================
  const toast = document.createElement('div');
  toast.className = 'download-toast';
  toast.innerHTML = `
    <span class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">✓</span>
    <div>
      <div class="text-sm font-bold text-emerald-400">Starting APK Download...</div>
      <div class="text-xs opacity-75">APNA FPS UNLOCKER v1.4.0 (15 MB)</div>
    </div>
  `;
  document.body.appendChild(toast);

  let toastTimer = null;
  document.querySelectorAll('a[href*=".apk"]').forEach(btn => {
    btn.addEventListener('click', () => {
      toast.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    });
  });

  // ==========================================
  // 8. STICKY MOBILE DOWNLOAD BAR (Android Responsive)
  // ==========================================
  const stickyBar = document.getElementById('stickyDownloadBar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyBar.classList.add('show');
      } else {
        stickyBar.classList.remove('show');
      }
    }, { passive: true });
  }

  // ==========================================
  // 9. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const arrow = item.querySelector('.faq-arrow');

    if (header && answer) {
      header.addEventListener('click', () => {
        const isOpen = !answer.classList.contains('hidden');
        faqItems.forEach(other => {
          other.querySelector('.faq-answer')?.classList.add('hidden');
          const otherArrow = other.querySelector('.faq-arrow');
          if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          answer.classList.remove('hidden');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // ==========================================
  // 10. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ==========================================
  // 11. DYNAMIC APP UPDATER ENGINE (Zero Hardcoding)
  // Fetches live data from https://apnafpsbooster.com/json/update.json
  // ==========================================
  const REMOTE_UPDATE_URL = 'https://apnafpsbooster.com/json/update.json';
  const LOCAL_UPDATE_URL = 'json/update.json';

  // Safe default fallback configuration
  const DEFAULT_APP_CONFIG = {
    version: "4.7.0",
    versionCode: 261113,
    apkUrl: "https://github.com/BYSHAHBAJ/APPOPEN/releases/download/120FPS/APNA.FPS.UNLOCKER_1.4.0.apk",
    forceUpdate: true,
    changelog: [
      "Performance improvements & 120 FPS ultra-low latency engine",
      "BGMI 4.7 Update Support & PUBG Mobile regional compatibility",
      "Android 17 & Shizuku seamless service synchronization",
      "Bug fixes, zero thermal throttling, and battery drain reduction"
    ]
  };

  let activeAppConfig = (() => {
    try {
      const cached = localStorage.getItem('apna_app_config');
      if (cached) return JSON.parse(cached);
    } catch(e) {}
    return DEFAULT_APP_CONFIG;
  })();

  const applyAppConfigToUI = (config) => {
    if (!config) return;
    activeAppConfig = config;

    // 1. Update all download buttons with the APK URL
    const downloadButtons = document.querySelectorAll('[data-dynamic="download-url"]');
    downloadButtons.forEach(btn => {
      btn.setAttribute('href', config.apkUrl);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });

    // 2. Update all version texts
    const versionTexts = document.querySelectorAll('[data-dynamic="version"]');
    versionTexts.forEach(el => {
      el.textContent = 'v' + config.version;
    });

    // 3. Update all version badges
    const versionBadges = document.querySelectorAll('[data-dynamic="version-badge"]');
    versionBadges.forEach(el => {
      el.textContent = '(v' + config.version + ')';
    });

    // 4. Update dynamic changelog list if available
    const changelogList = document.getElementById('dynamicChangelogList');
    if (changelogList && Array.isArray(config.changelog) && config.changelog.length > 0) {
      changelogList.innerHTML = config.changelog.map(item => `
        <li class="flex items-start gap-2.5">
          <span class="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>${item}</span>
        </li>
      `).join('');
    }

    // 5. Update fetch status indicator
    const statusEl = document.getElementById('updateFetchStatus');
    if (statusEl) {
      statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Live v${config.version} Synced`;
    }
  };

  // Apply cached or default config immediately so UI is always populated instantly
  applyAppConfigToUI(activeAppConfig);

  // Fetch live config asynchronously with cache busting
  const fetchUpdateConfig = async () => {
    const urlsToTry = [
      `${REMOTE_UPDATE_URL}?_t=${Date.now()}`,
      LOCAL_UPDATE_URL
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, {
          cache: 'no-cache',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.version && data.apkUrl) {
            applyAppConfigToUI(data);
            try {
              localStorage.setItem('apna_app_config', JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        }
      } catch (err) {
        // Fallback to next url
      }
    }

    // If both fetches fail (e.g. offline or strict file:/// security), fallback cleanly
    applyAppConfigToUI(DEFAULT_APP_CONFIG);
  };

  fetchUpdateConfig();

  // Safety click interceptor & Google Analytics Event Tracker:
  // Tracks every APK download event in GA4 and ensures seamless link opening!
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dynamic="download-url"]');
    if (btn) {
      // 1. Send download event to Google Analytics (GA4: G-WZD9PXTYRD)
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'download_apk', {
            event_category: 'Downloads',
            event_label: 'APNA FPS UNLOCKER APK',
            app_version: activeAppConfig.version,
            download_url: activeAppConfig.apkUrl
          });
        }
      } catch (err) {}

      // 2. Fallback check: if URL is still empty/hash, open active APK URL immediately
      const currentHref = btn.getAttribute('href');
      if (!currentHref || currentHref === '#' || currentHref === '') {
        e.preventDefault();
        window.open(activeAppConfig.apkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  });

});
