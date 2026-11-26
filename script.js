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

  // Safe default fallback configuration (Real Play Store Live State)
  const DEFAULT_APP_CONFIG = {
    version: "4.7.0",
    versionCode: 261113,
    apkUrl: "https://github.com/BYSHAHBAJ/APPOPEN/releases/download/120FPS/APNA.FPS.UNLOCKER_1.4.0.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.wildsoulfury.shahbaj",
    packageName: "com.wildsoulfury.shahbaj",
    forceUpdate: true,
    playStoreStats: {
      downloads: "100+",
      rating: 4.4,
      ratingCount: 12,
      reviews: []
    },
    changelog: [
      "Google Play Store official certified release (Play Protect safe)",
      "Real-time Play Store stats synchronization",
      "Performance improvements & 120 FPS ultra-low latency engine",
      "BGMI 4.7 Update Support & PUBG Mobile regional compatibility",
      "Android 17 & Shizuku seamless service synchronization",
      "Bug fixes, zero thermal throttling, and battery drain reduction"
    ]
  };

  let activeAppConfig = (() => {
    try {
      const cached = localStorage.getItem('apna_app_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Clear old cached fake numbers
        if (parsed.playStoreStats && (parsed.playStoreStats.downloads === "5+" || parsed.playStoreStats.downloads === "5" || parsed.playStoreStats.ratingCount === 53120 || parsed.playStoreStats.downloads === "53,000+")) {
          parsed.playStoreStats = DEFAULT_APP_CONFIG.playStoreStats;
        }
        return parsed;
      }
    } catch(e) {}
    return DEFAULT_APP_CONFIG;
  })();

  let currentReviewsData = activeAppConfig.playStoreStats?.reviews || [];

  // Client-side HTML parser for Google Play live HTML
  const parsePlayStoreHtmlClient = (html) => {
    if (!html || typeof html !== 'string') return null;
    const res = {
      downloads: '100+',
      rating: null,
      ratingCount: 0,
      reviews: []
    };

    // 1. Downloads
    const dlM = html.match(/<div class="ClM7O">([^<]+)<\/div>\s*<div class="g1rdde">Downloads<\/div>/);
    if (dlM && dlM[1]) {
      res.downloads = dlM[1].trim();
    } else {
      const dlFallback = html.match(/([0-9\.,]+[KkMmBb\+]*)\s*Downloads/i);
      if (dlFallback && dlFallback[1]) res.downloads = dlFallback[1].trim();
    }

    // 2. Main app ds:5 blob parsing
    const ds5M = html.match(new RegExp("AF_initDataCallback\\s*\\(\\s*\\{key:\\s*'ds:5'[^d]*data:\\s*([\\s\\S]*?),\\s*sideChannel:"));
    if (ds5M && ds5M[1]) {
      try {
        const d5 = JSON.parse(ds5M[1]);
        if (Array.isArray(d5) && d5[1] && Array.isArray(d5[1][2])) {
          const target = d5[1][2];
          if (target[13] && target[13][0]) res.downloads = String(target[13][0]);
          if (target[51] && Array.isArray(target[51])) {
            const rVal = target[51][0] && target[51][0][1];
            const rCnt = target[51][2] && target[51][2][1];
            if (rVal) res.rating = Number(Number(rVal).toFixed(1));
            if (rCnt) res.ratingCount = parseInt(rCnt, 10);
          }
        }
      } catch (e) {}
    }

    // 3. Fallback for ratings from JSON-LD
    if (!res.rating) {
      const jldM = html.match(new RegExp('<script type="application/ld\\+json"[^>]*>([\\s\\S]*?)</script>', 'i'));
      if (jldM && jldM[1]) {
        try {
          const jld = JSON.parse(jldM[1]);
          if (jld.aggregateRating) {
            if (jld.aggregateRating.ratingValue) res.rating = Number(parseFloat(jld.aggregateRating.ratingValue).toFixed(1));
            if (jld.aggregateRating.ratingCount) res.ratingCount = parseInt(jld.aggregateRating.ratingCount, 10);
          }
        } catch (e) {}
      }
    }

    // 4. Real User Reviews extraction
    const reviewRegex = new RegExp('<div class="RHo1pe"[\\s\\S]*?<div class="X5PpBb">([^<]+)</div>[\\s\\S]*?aria-label="Rated ([1-5]) stars[\\s\\S]*?(?:<span class="bp9Aid">([^<]+)</span>)?[\\s\\S]*?<div class="h3YV2d">([\\s\\S]*?)</div>', 'g');
    let match;
    let count = 0;
    while ((match = reviewRegex.exec(html)) !== null && count < 20) {
      const author = match[1] ? match[1].trim() : 'Google Play User';
      const stars = match[2] ? parseInt(match[2], 10) : 5;
      const date = match[3] ? match[3].trim() : 'Google Play Verified';
      const comment = match[4] ? match[4].replace(/<[^>]+>/g, '').trim() : '';

      if (comment && comment.length > 2) {
        res.reviews.push({
          id: `gp-review-${count + 1}`,
          name: author,
          avatar: author.charAt(0).toUpperCase(),
          rating: stars,
          date: date,
          device: 'Google Play Verified User',
          comment: comment,
          verified: true
        });
        count++;
      }
    }

    return res;
  };

  // Render Live Reviews Grid
  const renderReviewsList = (reviews, filter = 'all') => {
    const container = document.getElementById('reviewsGridContainer');
    if (!container) return;

    const countEl = document.getElementById('countAllReviews');
    if (countEl) countEl.textContent = reviews ? reviews.length : 0;

    const playUrl = activeAppConfig.playStoreUrl || DEFAULT_APP_CONFIG.playStoreUrl;

    // When reviews array is empty (no reviews submitted on Google Play yet)
    if (!reviews || reviews.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 sm:p-12 rounded-3xl border-2 border-dashed border-emerald-500/30 bg-black/40 text-center backdrop-blur-md">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-amber-400 text-3xl mb-4 shadow-lg shadow-emerald-500/10 animate-bounce">
            ★
          </div>
          <div class="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-3">
            ● Google Play Store Live Sync
          </div>
          <h3 class="font-gaming text-2xl sm:text-3xl font-black text-white mb-3">
            BE THE FIRST PLAYER TO REVIEW!
          </h3>
          <p class="text-xs sm:text-sm theme-text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
            APNA FPS UNLOCKER Google Play Store par official release ho chuka hai! Abhi tak Play Store par koi public review submit nahi hua hai. App download karein, 120 FPS test karein aur pehle verified player baniye jo Google Play par apna rating &amp; review likhein.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="${playUrl}" target="_blank" rel="noopener noreferrer" data-dynamic="playstore-url" class="btn-playstore px-6 py-3.5 rounded-xl font-gaming font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2.5 shadow-xl">
              <span class="text-amber-400 text-sm">★</span>
              <span>Write a Review on Google Play</span>
            </a>
          </div>
          <div class="mt-5 text-[11px] theme-text-muted flex items-center justify-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time Live Sync: Jaise hi aap ya koi bhi gamer Play Store par review dega, wo directly yahan website par live update ho jayega!</span>
          </div>
        </div>
      `;
      return;
    }

    const filtered = filter === 'all'
      ? reviews
      : reviews.filter(r => r.rating === parseInt(filter, 10));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-10 theme-text-muted">
          Koi reviews nahi mile is rating filter ke sath.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(r => {
      const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(Math.max(0, 5 - (r.rating || 5)));
      const avatarLetter = (r.name || 'G').charAt(0).toUpperCase();
      const safeComment = (r.comment || '').replace(new RegExp('"', 'g'), '&quot;');
      const safeAuthor = (r.name || 'Google Play User').replace(new RegExp('"', 'g'), '&quot;');
      const safeDate = r.date || 'Google Play Verified';
      const safeDevice = r.device || 'Google Play Verified User';

      return `
        <div class="review-card glass-panel" data-rating="${r.rating || 5}">
          <div>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="review-avatar">${avatarLetter}</div>
                <div>
                  <div class="font-bold text-sm theme-text-primary flex items-center gap-1.5">
                    <span>${safeAuthor}</span>
                    <span class="text-cyan-400 text-xs" title="Google Play Verified User">✓</span>
                  </div>
                  <div class="text-[11px] theme-text-muted">${safeDevice}</div>
                </div>
              </div>
              <span class="text-[10px] text-emerald-400 font-mono">${safeDate}</span>
            </div>

            <div class="text-amber-400 text-sm tracking-wider mb-2 font-black">${stars}</div>
            <p class="text-xs sm:text-sm theme-text-secondary leading-relaxed">
              "${safeComment}"
            </p>
          </div>

          <div class="mt-4 pt-3 border-t theme-border flex items-center justify-between text-[10px] theme-text-muted">
            <span class="flex items-center gap-1 text-cyan-400 font-semibold">
              <svg class="w-3 h-3" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9.2.2z"/><path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/><path d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z"/><path d="M486.8 238.5L403.4 191l-78.1 78.1 78.1 78.1 83.4-47.5c17.5-10 25.3-24.8 25.3-30.6s-7.8-20.6-25.3-30.6z"/></svg>
              Google Play Review
            </span>
            <span class="text-emerald-400 font-semibold">120 FPS Verified</span>
          </div>
        </div>
      `;
    }).join('');
  };

  const applyAppConfigToUI = (config) => {
    if (!config) return;
    activeAppConfig = config;

    // 1. Update all APK download buttons
    const downloadButtons = document.querySelectorAll('[data-dynamic="download-url"]');
    downloadButtons.forEach(btn => {
      btn.setAttribute('href', config.apkUrl || DEFAULT_APP_CONFIG.apkUrl);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });

    // 2. Update all Google Play Store buttons
    const playStoreButtons = document.querySelectorAll('[data-dynamic="playstore-url"]');
    playStoreButtons.forEach(btn => {
      btn.setAttribute('href', config.playStoreUrl || DEFAULT_APP_CONFIG.playStoreUrl);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });

    // 3. Update all version texts
    const versionTexts = document.querySelectorAll('[data-dynamic="version"]');
    versionTexts.forEach(el => {
      el.textContent = 'v' + config.version;
    });

    // 4. Update all version badges
    const versionBadges = document.querySelectorAll('[data-dynamic="version-badge"]');
    versionBadges.forEach(el => {
      el.textContent = '(v' + config.version + ')';
    });

    // 5. Update dynamic changelog list if available
    const changelogList = document.getElementById('dynamicChangelogList');
    if (changelogList && Array.isArray(config.changelog) && config.changelog.length > 0) {
      changelogList.innerHTML = config.changelog.map(item => `
        <li class="flex items-start gap-2.5">
          <span class="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>${item}</span>
        </li>
      `).join('');
    }

    // 6. Update fetch status indicator
    const statusEl = document.getElementById('updateFetchStatus');
    if (statusEl) {
      statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Live v${config.version} Synced`;
    }

    // 7. Update Live Google Play Stats & Reviews Showcase
    if (config.playStoreStats) {
      const stats = config.playStoreStats;

      const heroRating = document.getElementById('livePlayRatingHero');
      if (heroRating) {
        if (stats.rating && Number(stats.rating) > 0) {
          heroRating.textContent = Number(stats.rating).toFixed(1);
        } else {
          heroRating.textContent = "NEW";
        }
      }
      const heroCount = document.getElementById('livePlayRatingCountHero');
      if (heroCount) {
        if (stats.ratingCount && Number(stats.ratingCount) > 0) {
          heroCount.textContent = Number(stats.ratingCount).toLocaleString('en-US') + '+';
        } else {
          heroCount.textContent = "0 reviews";
        }
      }
      const heroDownloads = document.getElementById('livePlayDownloadsHero');
      if (heroDownloads && stats.downloads) {
        heroDownloads.textContent = stats.downloads + ' Active Players';
      }
      const topDownloads = document.getElementById('heroActiveGamers');
      if (topDownloads && stats.downloads) {
        topDownloads.textContent = stats.downloads;
      }
      const topRating = document.getElementById('heroRatingVal');
      if (topRating) {
        if (stats.rating && Number(stats.rating) > 0) {
          topRating.textContent = Number(stats.rating).toFixed(1) + ' ★';
        } else {
          topRating.textContent = 'NEW ★';
        }
      }

      // Render Dynamic Reviews Grid
      currentReviewsData = Array.isArray(stats.reviews) ? stats.reviews : [];
      renderReviewsList(currentReviewsData, 'all');
    }
  };

  // Review Filter Chips Event Listeners
  document.querySelectorAll('.review-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.review-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderReviewsList(currentReviewsData, filter);
    });
  });

  // Apply cached or default config immediately so UI is always populated instantly
  applyAppConfigToUI(activeAppConfig);
    // Bandwidth-Optimized Fetch: 30-Minute Local Cache to save 90%+ hosting bandwidth & data
    const fetchUpdateConfig = async () => {
      // 1. Check Data Saver Mode or 2G network on mobile
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isDataSaver = conn && (conn.saveData || /2g/.test(conn.effectiveType || ''));

      // 2. LocalStorage 30-Minute TTL Cache Check
      const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
      const lastFetchTs = Number(localStorage.getItem('apna_config_last_fetch') || 0);
      const isCacheFresh = (Date.now() - lastFetchTs) < CACHE_TTL_MS;

      if (isCacheFresh || isDataSaver) {
        // Reuse fresh local cache, 0 bytes network bandwidth consumed!
        return;
      }

      // Fetch version config (respects CDN edge caching)
      const urlsToTry = [
        LOCAL_UPDATE_URL,
        REMOTE_UPDATE_URL
      ];

      for (const url of urlsToTry) {
        try {
          const res = await fetch(url, {
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.version && (data.apkUrl || data.playStoreUrl)) {
              applyAppConfigToUI(data);
              try {
                localStorage.setItem('apna_app_config', JSON.stringify(data));
                localStorage.setItem('apna_config_last_fetch', String(Date.now()));
              } catch (e) {}
              break;
            }
          }
        } catch (err) {}
      }

      // Live Google Play Store real-time fetch (Only when cache has expired)
      const playEndpoints = [
        '/api/playstore',
        `https://api.allorigins.win/raw?url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.wildsoulfury.shahbaj&hl=en&gl=US')}`
      ];

      for (const endpoint of playEndpoints) {
        try {
          const res = await fetch(endpoint);
          if (res.ok) {
            let liveData = null;
            if (endpoint.startsWith('/api/')) {
              liveData = await res.json();
            } else {
              const rawHtml = await res.text();
              liveData = parsePlayStoreHtmlClient(rawHtml);
            }

            if (liveData && (liveData.downloads || liveData.reviews !== undefined)) {
              activeAppConfig.playStoreStats = {
                downloads: liveData.downloads || "100+",
                rating: liveData.rating || null,
                ratingCount: liveData.ratingCount || 0,
                reviews: Array.isArray(liveData.reviews) ? liveData.reviews : []
              };
              applyAppConfigToUI(activeAppConfig);
              try {
                localStorage.setItem('apna_app_config', JSON.stringify(activeAppConfig));
                localStorage.setItem('apna_config_last_fetch', String(Date.now()));
              } catch (e) {}
              break;
            }
          }
        } catch (e) {}
      }
    };

    fetchUpdateConfig();

    // Safety click interceptor & Google Analytics Event Tracker for Play Store & APK downloads
    document.addEventListener('click', (e) => {
      // A. GOOGLE PLAY STORE CLICK HANDLER (Direct Native Intent & Web Fallback)
      const playBtn = e.target.closest('[data-dynamic="playstore-url"]');
      if (playBtn) {
        const playUrl = activeAppConfig.playStoreUrl || DEFAULT_APP_CONFIG.playStoreUrl;
        const pkg = activeAppConfig.packageName || DEFAULT_APP_CONFIG.packageName;
        const marketUrl = `market://details?id=${pkg}`;

        // 1. Send click event to GA4
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'click_playstore', {
              event_category: 'Downloads',
              event_label: 'Google Play Store',
              app_version: activeAppConfig.version,
              store_url: playUrl
            });
          }
        } catch (err) {}

        // 2. Direct native Play Store app launch on Android devices
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          e.preventDefault();
          window.location.href = marketUrl;

          setTimeout(() => {
            if (!document.hidden) {
              window.open(playUrl, '_blank', 'noopener,noreferrer');
            }
          }, 1200);
        }
      }

      // B. DIRECT APK DOWNLOAD CLICK HANDLER
      const apkBtn = e.target.closest('[data-dynamic="download-url"]');
      if (apkBtn) {
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'download_apk', {
              event_category: 'Downloads',
              event_label: 'Direct APK',
              app_version: activeAppConfig.version,
              download_url: activeAppConfig.apkUrl
            });
          }
        } catch (err) {}
      }
    });

    // ==========================================
    // 10. APNA GAMING AI ASSISTANT (LLM BOT WIDGET)
    // Deep In-Page Semantic Indexing: FAQs, Features, Processor Matrix,
    // Shizuku Setup, Anti-Ban Science, Low-RAM Modes, Gyro Sync & In-Page Deep-Linking
    // ==========================================
    const aiBotTrigger = document.getElementById('aiBotTrigger');
    const aiChatPanel = document.getElementById('aiChatPanel');
    const aiChatClose = document.getElementById('aiChatClose');
    const aiChatReset = document.getElementById('aiChatReset');
    const aiChatForm = document.getElementById('aiChatForm');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiChipsContainer = document.getElementById('aiChipsContainer');

    if (aiBotTrigger && aiChatPanel) {
      let conversationContext = {
        userDevice: null,
        lastTopic: null
      };

      const toggleAIChat = (show) => {
      if (show) {
        aiChatPanel.classList.remove('hidden');
        if (aiChatInput) setTimeout(() => aiChatInput.focus(), 200);
      } else {
        aiChatPanel.classList.add('hidden');
      }
    };

    // Smooth In-Page Section Deep Linker with Glowing Highlight
    window.jumpToWebsiteSection = (sectionId) => {
      const target = document.getElementById(sectionId);
      if (target) {
        // On mobile screens, close the chat so user can view the section
        if (window.innerWidth < 640) {
          toggleAIChat(false);
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Add glowing pulse border to the target section
        target.classList.add('section-highlight-glow');
        setTimeout(() => target.classList.remove('section-highlight-glow'), 2200);
      }
    };

    aiBotTrigger.addEventListener('click', () => {
      const isHidden = aiChatPanel.classList.contains('hidden');
      toggleAIChat(isHidden);
    });

    if (aiChatClose) {
      aiChatClose.addEventListener('click', () => toggleAIChat(false));
    }

    if (aiChatReset) {
      aiChatReset.addEventListener('click', () => {
        conversationContext = { userDevice: null, lastTopic: null };
        aiChatMessages.innerHTML = `
          <div class="flex gap-2.5 items-start">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">🤖</div>
            <div class="p-3 rounded-2xl rounded-tl-none bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-primary)] leading-relaxed">
              <p class="font-semibold text-emerald-400 mb-1">Chat Reset! 👋</p>
              Main <strong>APNA FPS UNLOCKER</strong> ka Official AI Assistant hoon. Website ke kisi bhi feature, FAQs, processor compatibility, ya Shizuku setup ke baare me poochiye!
            </div>
          </div>
        `;
        renderFollowUpChips(['🛒 Google Play Store', '📥 Download APK', '📱 Check Device', '⚡ 120 FPS Simulator', '🛡️ Anti-Ban Architecture', '📖 Step-by-Step Guide']);
      });
    }

    const renderFollowUpChips = (chipList) => {
      if (!aiChipsContainer) return;
      aiChipsContainer.innerHTML = chipList.map(text => `
        <button type="button" class="ai-chip px-2.5 py-1 rounded-full border theme-border hover:border-emerald-400 hover:text-emerald-400 transition-colors">${text}</button>
      `).join('');

      aiChipsContainer.querySelectorAll('.ai-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawText = btn.textContent.replace(/[📱⚡🛡️📥🔥🎮💡🔧📖📊📸❓🍎🛒]/g, '').trim();
          handleUserQuery(rawText);
        });
      });
    };

    const appendAIMessage = (text, isUser = false) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : ''} animate-fadeIn`;

      const iconDiv = document.createElement('div');
      iconDiv.className = `w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 shadow-sm ${
        isUser ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-400'
      }`;
      iconDiv.textContent = isUser ? '👤' : '🤖';

      const bubble = document.createElement('div');
      bubble.className = `p-3.5 rounded-2xl ${
        isUser
          ? 'rounded-tr-none bg-cyan-500/20 border border-cyan-500/30 text-[var(--text-primary)] text-right'
          : 'rounded-tl-none bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-primary)]'
      } leading-relaxed text-xs max-w-[88%] shadow-md`;
      bubble.innerHTML = text;

      // Bind in-chat jump pill buttons
      bubble.querySelectorAll('.ai-jump-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-target');
          if (target) window.jumpToWebsiteSection(target);
        });
      });

      msgDiv.appendChild(iconDiv);
      msgDiv.appendChild(bubble);
      aiChatMessages.appendChild(msgDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    };

    // Normalized NLP String Cleaner
    const cleanNLPText = (txt) => {
      return txt.toLowerCase()
        .replace(/([0-9]+)\s*hz/g, '$1hz')
        .replace(/([a-z]+)([0-9]+)/g, '$1 $2')
        .replace(/([0-9]+)([a-z]+)/g, '$1 $2')
        .replace(/plus/g, '+')
        .replace(/[^a-z0-9\+\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Live In-Page Content Extractor: Syncs AI with actual DOM content
    const getWebsiteLiveContext = () => {
      const stats = {
        users: activeAppConfig.playStoreStats?.downloads || document.getElementById('heroActiveGamers')?.textContent || '100+',
        rating: activeAppConfig.playStoreStats?.rating ? `${activeAppConfig.playStoreStats.rating} ★` : 'New',
        version: activeAppConfig.version || '4.7.0',
        apkUrl: activeAppConfig.apkUrl || 'https://github.com/BYSHAHBAJ/APPOPEN/releases/download/120FPS/APNA.FPS.UNLOCKER_1.4.0.apk',
        playStoreUrl: activeAppConfig.playStoreUrl || 'https://play.google.com/store/apps/details?id=com.wildsoulfury.shahbaj'
      };
      return stats;
    };

    // Deep Website-Aware AI Query Processor
    const processWebsiteAwareAIQuery = (query) => {
      const rawQ = query.toLowerCase().trim();
      const nlp = cleanNLPText(query);
      const live = getWebsiteLiveContext();

      // ==========================================
      // A. WEBSITE FAQ & TROUBLESHOOTING MAPPINGS
      // ==========================================

      // FAQ #9 & Feature #6: Crash & Restore Default Settings
      if (['crash', 'band ho gaya', 'black screen', 'default setting', 'reset', 'restore', 'factory reset', 'normal kaise', 'wapas kaise', 'pehle jaisa'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'crash_restore';
        return {
          text: `🔄 <strong>1-Tap Default Restore (Website Feature #6 & FAQ #9):</strong><br>
          Agar kisi setting ke baad game crash ho ya aap normal factory mode par lautna chahte hain:<br><br>
          • <strong>Solution:</strong> APNA FPS UNLOCKER app me <strong>'Restore Default Settings'</strong> ka dedicated button diya gaya hai.<br>
          • <strong>Zero Data Loss:</strong> Ek tap me aapka game aur display refresh rate original official state me restore ho jata hai bina kisi game file ko nuksan pahunchaye!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ View FAQ #9 On Page →</button>`,
          chips: ['⚡ How to Install', '🛡️ Anti-Ban Architecture', '📥 Download APK']
        };
      }

      // FAQ #8: Live FPS Meter & Game Turbo
      if (['fps meter', 'meter kaise', 'fps kaise check', 'counter', 'fps show', 'fps display', 'game turbo', 'game space', 'live fps'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'fps_meter';
        return {
          text: `📊 <strong>Live FPS Meter Kaise Check Karein? (Website FAQ #8):</strong><br>
          BGMI me real-time 90 FPS ya 120 FPS verify karne ka sabse authentic tarika:<br><br>
          1. Apne phone ka in-built <strong>Game Turbo / Game Space / Ultra Game Mode</strong> (Xiaomi, OnePlus, Realme, iQOO, Samsung) open karein.<br>
          2. Wahan floating <strong>Real-time FPS Monitor</strong> ko enable karein.<br>
          3. Match start hone par wahan live <strong>90 FPS ya 120 FPS</strong> lock dikhega!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ View FAQ #8 On Page →</button>`,
          chips: ['⚡ Try Simulator', '📱 Check Device', '📥 Download APK']
        };
      }

      // FAQ #3: 60Hz / 90Hz Display Reality vs 120 FPS Render
      if (['60hz', '90hz', 'refresh rate', 'display limit', 'screen hz', 'panel 60', 'kya 60hz', '60 hz', '90 hz'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'display_hz';
        return {
          text: `📱 <strong>60Hz / 90Hz vs 120 FPS (Website FAQ #3 Explained):</strong><br>
          • <strong>Touch & Latency Faayda:</strong> App aapke phone ka internal render rate 120 FPS (8.3ms frame time) par boost karta hai, jisse touch gyro reaction instantaneous ho jata hai!<br>
          • <strong>Visual Panel Reality:</strong> Screen visually utne hi frames display karegi jitna panel ka hardware limit hai (jaise 60Hz par 60 frames, 90Hz par 90 frames).<br>
          • <strong>Verdict:</strong> 60Hz phones par bhi micro-stutter aur combat frame drops 100% khatam ho jate hain!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ View FAQ #3 On Page →</button>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors ml-2" data-target="simulator">⚡ Try 120 FPS Simulator →</button>`,
          chips: ['⚡ 120 FPS Simulator', '📱 Check Device', '📥 Download APK']
        };
      }

      // FAQ #4: Low-End Devices & 4GB / 6GB RAM Mode
      if (['4gb', '6gb ram', 'low end', 'sasta phone', 'ram kam', 'kam ram', '3gb', '2gb', 'purana phone', 'budget phone'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'low_end_ram';
        return {
          text: `💡 <strong>4GB & 6GB RAM Low-End Devices Optimization (Website FAQ #4):</strong><br>
          Haan! Low-end phones ke liye app me specific <strong>Smooth + 60/90 FPS Config Profile</strong> hai:<br><br>
          • <strong>RAM Cleaner Engine:</strong> Unnecessary background services ko automatically freeze karke game ko 95%+ CPU/GPU allocation deta hai.<br>
          • <strong>Zero Lag in Hot-Drops:</strong> Boot camp aur Pochinki me hone wale sudden frame freezes ko eliminate karta hai.<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ View FAQ #4 On Page →</button>`,
          chips: ['🔥 Fix Heating', '⚡ How to Install', '📥 Download APK']
        };
      }

      // FAQ #5: Game Update / Patch Recovery (BGMI 4.7)
      if ((['update', 'patch', 'naya version', 'naya season', 'season update'].some(w => rawQ.includes(w)) ||
           ['settings hat gayi', 'gayab ho gaya'].some(w => rawQ.includes(w))) &&
          !['download', 'apk link', 'download link'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'patch_update';
        return {
          text: `🔄 <strong>Game Update ke Baad FPS Restore Karna (Website FAQ #5):</strong><br>
          Jab bhi KRAFTON BGMI ya PUBG ka naya patch (jaise 4.7 update) launch karta hai:<br><br>
          1. <strong>APNA FPS UNLOCKER</strong> app open karein.<br>
          2. Naya update edition select karein.<br>
          3. Ek tap me <strong>'Apply 120 FPS'</strong> karein.<br>
          Aapki sabhi high-framerate settings instantly re-bind ho jayengi!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ View FAQ #5 On Page →</button>`,
          chips: ['📥 Download Latest APK', '⚡ How to Install', '📱 Check Device']
        };
      }

      // Feature #5: Ultra Touch & Gyro Zero Delay
      if (['gyro', 'gyroscope', 'delay', 'touch latency', 'touch response', 'touch sampling', 'flick', 'sensi', 'sensitivity', 'recoil'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'touch_gyro';
        return {
          text: `🎯 <strong>Ultra Touch & Gyro Zero Delay Engine (Website Feature #5):</strong><br>
          • <strong>8.3ms Frame Pairing:</strong> APNA FPS UNLOCKER display touch sampling rate ko game ke 120 FPS frame cycle ke sath perfect sync karta hai.<br>
          • <strong>Flick Response:</strong> Fast gyroscope flicks, close-range jiggle aur sniper quick-scopes me zero millisecond delay rehta hai.<br>
          • <strong>No Desync:</strong> Spray control laser-accurate feel hota hai!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="features">⚡ View Touch & Gyro Feature →</button>`,
          chips: ['⚡ 120 FPS Simulator', '📱 Check Device', '📥 Download APK']
        };
      }

      // Game Editions & Regions Supported (Specs Table)
      if (['kr version', 'korea', 'global', 'bgmi air', 'lite', 'vietnam', 'taiwan', 'tw', 'vn', 'edition support', 'kon kon sa game'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'game_editions';
        return {
          text: `🎮 <strong>All Supported Game Editions (From Website Specs Table):</strong><br><br>
          • <strong>BGMI 4.7 (India 🇮🇳):</strong> Up to 120 / 165 FPS (100% Anti-Ban Safe)<br>
          • <strong>BGMI AIR / Lite (India 🇮🇳):</strong> Up to 90 FPS Ultra-Smooth<br>
          • <strong>PUBG MOBILE 4.7 (Global 🌐):</strong> Up to 120 FPS Locked<br>
          • <strong>PUBG MOBILE KR (Korea / Japan 🇰🇷):</strong> Up to 120 FPS<br>
          • <strong>PUBG MOBILE TW / VN (Taiwan & Vietnam 🇻🇳):</strong> Up to 120 FPS<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="specs">📊 View Full Compatibility Table →</button>`,
          chips: ['⚡ How to Install', '🛡️ Anti-Ban Architecture', '📥 Download APK']
        };
      }

      // ==========================================
      // B. CORE SECTIONS DEEP MAPPINGS
      // ==========================================

      // 1. 120 FPS Motion Simulator (16.6ms vs 8.3ms)
      if (['simulator', 'motion', 'compare', 'farak', 'difference', '16.6ms', '8.3ms', 'jitter', 'smoothness'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'simulator';
        return {
          text: `⚡ <strong>120 FPS Motion Simulator (From Website Section):</strong><br>
          Hamari website ke interactive simulator me aap 60 FPS aur 120 FPS ka live farak dekh sakte hain:<br><br>
          • <strong>60 FPS:</strong> Har frame <strong>16.6ms</strong> me render hota hai — fast pacing aur enemy spray ke time micro-jitters mehsus hote hain.<br>
          • <strong>120 FPS:</strong> Har frame only <strong>8.3ms</strong> me render hota hai — motion bilkul fluid aur eye-tracking crystal clear rehti hai!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="simulator">⚡ Try Live Simulator On Page →</button>`,
          chips: ['📱 Check Device', '🔥 Fix Heating', '📥 Download APK']
        };
      }

      // 2. Specifications Table & Live Decoupled Engine
      if (['spec', 'specs', 'specification', 'size', 'package', 'changelog', 'what is new', 'kya naya hai', 'version details'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'specs';
        return {
          text: `📊 <strong>Official App Specifications (Latest v${live.version}):</strong><br>
          • <strong>App Name:</strong> APNA FPS UNLOCKER<br>
          • <strong>Release Version:</strong> v${live.version} (Live Decoupled Engine)<br>
          • <strong>Package Size:</strong> ~15 MB (Direct Fastly/GitHub APK, Zero Ads)<br>
          • <strong>Android Support:</strong> Android 9.0 up to Android 17<br>
          • <strong>Root Required:</strong> No (Shizuku Wireless Debugging Support)<br>
          • <strong>Developer:</strong> Cipher Leaks • <strong>License:</strong> 100% Free<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="specs">📊 View Full Specs Table On Page →</button>`,
          chips: ['📖 How to Install', '🛡️ Anti-Ban Architecture', '📥 Download APK']
        };
      }

      // 3. Safety Architecture & Anti-Ban (Direct from #safety section)
      if (['ban', 'anti ban', 'safe', 'safety', 'active.sav', 'pak file', 'id ban', 'account ban', 'cheat', 'hack', 'third party', '10 saal', 'illegal', 'risk'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'safety';
        return {
          text: `🛡️ <strong>Why APNA FPS UNLOCKER is 100% Safe (Website Architecture):</strong><br>
          Website ke Safety section me saaf bataya gaya hai ki ordinary GFX tools aur Telegram configs game ki <code>Active.sav</code> ya OBB <code>.pak</code> files ko overwrite karte hain, jisse KRAFTON server anti-cheat MD5 mismatch detect karke permanent ID ban laga deta hai.<br><br>
          <strong>APNA FPS UNLOCKER Alag Kaise Hai?</strong><br>
          • Yeh Android ke official <strong>Display SurfaceManager</strong> aur <strong>Shizuku Wireless Debugging API</strong> ka use karta hai.<br>
          • Game ki installation files me zero tampering hoti hai.<br>
          • <strong>Google Play Protect certified</strong> hai aur 0 ban rate hai!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="safety">🛡️ Open Safety Architecture Section →</button>`,
          chips: ['⚡ How to Install', '📱 Check Device', '📥 Download APK']
        };
      }

      // 4. Step-by-Step Installation Guide (Direct from #how-to-install section)
      if (['how to install', 'kaise install', 'kaise chalaye', 'step', 'steps', 'setup', 'tutorial', 'guide'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'install';
        return {
          text: `📖 <strong>3 Simple Steps to Unlock 120 FPS (From Website Guide):</strong><br><br>
          <strong>Step 1: Download Official APK</strong><br>
          Website ke download button se APK download karke install karein.<br><br>
          <strong>Step 2: Select Game & Edition</strong><br>
          App open karein aur BGMI 4.7 (India) ya apna specific PUBG Mobile region select karein.<br><br>
          <strong>Step 3: Choose Frame Rate & Apply</strong><br>
          90 FPS ya 120 FPS select karke 'Apply' par tap karein. Game open karke Settings > Graphics me verify karein!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="how-to-install">📖 View 3-Step Guide On Page →</button>`,
          chips: ['⚡ Shizuku Setup', '📱 Check Device', '📥 Download APK']
        };
      }

      // 5. In-Game Screenshots & Proof
      if (['screenshot', 'proof', 'photo', 'image', 'lobby', 'in game', 'setting dikhao'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'screenshots';
        return {
          text: `📸 <strong>In-Game Proof & HD Screenshots:</strong><br>
          Website ke Screenshots section me live verified game captures hain:<br>
          • 165 FPS Extreme settings toggle<br>
          • Real-time performance HUD overlay (8.3ms locked)<br>
          • BGMI Lobby & Combat graphics preference synchronization<br>
          • Colorful vs Realistic visual styles comparison<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="screenshots">📸 View 16:9 HD Gallery On Page →</button>`,
          chips: ['⚡ Try Simulator', '📊 System Specs', '📥 Download APK']
        };
      }

      // 6. Processor Matrix from Website #processors section
      if (['processor', 'snapdragon', 'dimensity', 'exynos', 'tensor', 'gpu', 'adreno', 'mali'].some(w => rawQ.includes(w)) ||
          ['8 gen', '870', '888', '778g', '9000', '9200', '9300', '8200', '8100', '7200', 'g99'].some(w => nlp.includes(w))) {
        conversationContext.lastTopic = 'processors';
        return {
          text: `📱 <strong>Best FPS Settings by Processor (From Website Matrix):</strong><br><br>
          • <strong>Snapdragon 8 Gen 1 / 2 / 3 / Elite:</strong> 120 FPS Locked (Ultra Smooth / HDR)<br>
          • <strong>Snapdragon 870 / 888 / 7+ Gen 2:</strong> 90 / 120 FPS Stable<br>
          • <strong>Snapdragon 778G / 695:</strong> 60 / 90 FPS Stable<br>
          • <strong>Dimensity 9000 / 9200 / 9300 / 9400:</strong> 120 FPS Extreme<br>
          • <strong>Dimensity 8100 / 8200 / 7200 / 8300:</strong> 90 / 120 FPS Stable<br>
          • <strong>Helio G99 / G96:</strong> 60 FPS Locked (Zero Throttle)<br>
          • <strong>Exynos 2400 / 2200 & Tensor G2/G3/G4:</strong> 90 / 120 FPS Supported<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="processors">📱 View Full Processor Matrix →</button>`,
          chips: ['⚡ Shizuku Setup', '🔥 Fix Heating', '📥 Download APK']
        };
      }

      // 7. FAQs Overview
      if (['faq', 'question', 'sawal', 'doubt', 'madad'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'faq';
        return {
          text: `❓ <strong>Frequently Asked Questions (10 Verified FAQs on Page):</strong><br>
          Website ke FAQ section me gamers ke top sawalon ke detailed solutions available hain:<br>
          1. Account Ban Safety Guarantee<br>
          2. Root vs No-Root / Shizuku details<br>
          3. 60Hz / 90Hz vs 120Hz display refresh panel behavior<br>
          4. 4GB / 6GB RAM low-end device optimization<br>
          5. Game update hone par FPS settings restore karna<br>
          6. Crash recovery aur default settings reset<br>
          7. Live FPS meter check karne ka tarika<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="faq">❓ Open FAQ Accordion On Page →</button>`,
          chips: ['🛡️ Anti-Ban Architecture', '⚡ How to Install', '📥 Download APK']
        };
      }

      // 8. Apple iOS / iPhone Notice
      if (['iphone', 'ipad', 'ios', 'apple', 'macbook'].some(w => rawQ.includes(w))) {
        return {
          text: `🍎 <strong>Apple iOS / iPadOS Notice (Website FAQ #10):</strong><br>
          Website par FAQ #10 me mention kiya gaya hai: APNA FPS UNLOCKER sirf <strong>Android smartphones (Android 9 se lekar Android 17)</strong> ke liye designed hai.<br><br>
          iOS me strict sandbox system hone ke karan third-party refresh rate utilities allow nahi hoti. Agar aapke paas koi Android gaming device hai to usme try karein!<br><br>
          <a href="https://t.me/+me0XThXEQJhiMTVl" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline">Official Telegram Channel Join Karein →</a>`,
          chips: ['📱 Check Android Device', '⚡ How to Install', '📥 Download APK']
        };
      }

      // 9. Heating, Frame Drops & Joyose/GOS Throttling (From #features section & FAQ #7)
      if (['heat', 'garam', 'throttle', 'battery', 'drain', 'temp', 'temperature', 'hot', 'drop hota', 'fps drop', 'frame drop', 'freeze', 'lag'].some(w => rawQ.includes(w))) {
        return {
          text: `🔥 <strong>Zero Thermal Throttling & Battery Shield (Feature #4 & FAQ #7):</strong><br>
          BGMI me 10–15 minute khelne ke baad FPS 120 se drop hone ka karan OEM <em>Thermal Throttling</em> (jaise Xiaomi Joyose, Samsung GOS, ya OnePlus Battery service) hota hai.<br><br>
          <strong>Website Par Bataya Gaya Solution:</strong><br>
          1. <strong>APNA FPS UNLOCKER</strong> me <em>"Smart Thermal & Battery Shield"</em> activate karein.<br>
          2. Phone Settings > Battery me <strong>Performance Mode</strong> select karein.<br>
          3. Graphics me <strong>Smooth + 120 FPS</strong> rakhein.<br>
          4. Average temperature 38°C se 42°C ke beech perfectly stable rahega! ❄️<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="features">⚡ View Pro Features Section →</button>`,
          chips: ['🎮 Best Graphics Setting', '🛡️ Anti-Ban Architecture', '📥 Download APK']
        };
      }

      // 10. Shizuku Setup & Troubleshooting (From #how-to-install & FAQ #6)
      if (['shizuku', 'wireless debug', 'pair', 'pairing', 'shizuku setup', 'shizuku connect', 'pairing code', 'port error', 'service stopped', 'root', 'bina root', 'pc chahiye', 'bina computer'].some(w => rawQ.includes(w))) {
        return {
          text: `⚡ <strong>Complete Shizuku Setup (Website FAQ #6 & Android 11 – 17):</strong><br>
          1. Play Store se <strong>Shizuku</strong> app install karein (Zero Root required).<br>
          2. Phone Settings > <em>About Phone</em> me Build Number par 7 baar tap karke Developer Options enable karein.<br>
          3. Developer Options me <strong>Wireless Debugging</strong> ON karein.<br>
          4. <strong>Pairing Trick:</strong> Split-screen open karein. Shizuku me 'Pairing' tap karein aur notification ka 6-digit code enter karein.<br>
          5. Shizuku 'Started' show karega! Ab APNA FPS UNLOCKER me 120 FPS apply karein bina PC ya root ke!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="how-to-install">📖 View Visual Guide On Page →</button>`,
          chips: ['🛡️ Anti-Ban Safety', '📱 Check Device', '📥 Download APK']
        };
      }

      // ==========================================
      // C. SPECIFIC DEVICE COMPATIBILITY LOOKUP
      // ==========================================
      const flagshipsDB = [
        'poco x6 pro', 'poco x6', 'poco f5', 'poco f6', 'poco f4', 'poco x5 pro', 'poco x4 gt', 'poco f3',
        'iqoo neo 9', 'iqoo neo 7', 'iqoo neo 6', 'iqoo 12', 'iqoo 11', 'iqoo 9', 'iqoo z9', 'iqoo z7 pro',
        'oneplus 12', 'oneplus 12r', 'oneplus 11', 'oneplus 11r', 'oneplus 10 pro', 'oneplus 10r', 'oneplus 9 pro', 'oneplus 9rt', 'nord 3', 'nord 4',
        'realme gt 6', 'realme gt 2', 'realme gt neo', 'realme 12 pro', 'realme 12 pro +', 'realme 11 pro', 'realme 13 pro',
        'samsung s24', 'samsung s23', 'samsung s22', 'samsung s21', 's20 fe', 's21 fe', 's23 fe',
        'xiaomi 14', 'xiaomi 13', 'xiaomi 12', '13t pro', '14t pro', 'mi 11x', 'mi 11i',
        'rog phone', 'redmagic', 'black shark', 'infinix gt 20 pro', 'infinix gt 10 pro',
        'edge 50', 'edge 40', 'edge 30', 'nothing phone 2', 'nothing phone 1', 'nothing phone 2a'
      ];

      const midrange90DB = [
        'redmi note 13', 'redmi note 12', 'redmi note 11', 'realme 10', 'realme 11', 'realme 12',
        'galaxy a54', 'galaxy a55', 'galaxy a34', 'galaxy a35', 'galaxy m34', 'galaxy m54',
        'moto g84', 'moto g54', 'moto g73', 'nord ce 3', 'nord ce 4', 'vivo t3', 'vivo t2'
      ];

      const budget60DB = [
        'redmi 9', 'redmi 10', 'redmi 12c', 'redmi a1', 'redmi a2', 'redmi a3',
        'realme c11', 'realme c21', 'realme c31', 'realme c35', 'realme c53', 'realme c55', 'realme narzo',
        'galaxy a03', 'galaxy a04', 'galaxy a05', 'galaxy a13', 'galaxy a14',
        '2gb', '3gb', '4gb ram', 'helio g35', 'helio p35', 'snapdragon 680', 'snapdragon 685'
      ];

      const matchedFlagship = flagshipsDB.find(d => nlp.includes(d) || rawQ.includes(d));
      if (matchedFlagship) {
        conversationContext.userDevice = matchedFlagship.toUpperCase();
        return {
          text: `🔥 <strong>100% CONFIRMED FOR ${conversationContext.userDevice}:</strong><br>
          Aapka device high-performance processor aur 120Hz/144Hz AMOLED panel ke sath aata hai.<br><br>
          • <strong>Supported Mode:</strong> 90 FPS & 120 FPS Ultra-Smooth<br>
          • <strong>Touch Gyro Response:</strong> 8.3ms instant tracking<br>
          • <strong>Thermals:</strong> Zero throttling with APNA FPS UNLOCKER engine!<br><br>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" class="px-3.5 py-1.5 btn-cyber-primary text-xs inline-block rounded-lg font-bold">Download Latest APK (v${live.version})</a>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors ml-2" data-target="processors">View Processor Settings →</button>`,
          chips: ['⚡ Shizuku Setup', '🔥 Fix Heating', '🛡️ Anti-Ban Architecture']
        };
      }

      const matchedMidrange = midrange90DB.find(d => nlp.includes(d) || rawQ.includes(d));
      if (matchedMidrange) {
        conversationContext.userDevice = matchedMidrange.toUpperCase();
        return {
          text: `⚡ <strong>90 FPS SMOOTH CONFIRMED FOR ${conversationContext.userDevice}:</strong><br>
          Aapke device me 90Hz / 120Hz screen supported hai.<br><br>
          • <strong>Recommended Mode:</strong> <strong>Smooth + 90 FPS</strong> locked mode.<br>
          • <strong>Faayda:</strong> Long rank-push matches me battery kam kharch hogi aur zero thermal drop rahega!<br><br>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" class="px-3.5 py-1.5 btn-cyber-primary text-xs inline-block rounded-lg font-bold">Download APK (v${live.version})</a>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors ml-2" data-target="processors">View Settings Matrix →</button>`,
          chips: ['⚡ Shizuku Setup', '🎮 Best Graphics Setting', '🛡️ Anti-Ban Architecture']
        };
      }

      const matchedBudget = budget60DB.find(d => nlp.includes(d) || rawQ.includes(d));
      if (matchedBudget) {
        conversationContext.userDevice = matchedBudget.toUpperCase();
        return {
          text: `📱 <strong>Budget Device Optimization Mode (${conversationContext.userDevice}):</strong><br>
          Website ke FAQ #4 ke mutabiq: Aapka phone 60Hz panel ke sath aata hai (hardware limit 60 FPS hoti hai).<br><br>
          • <strong>APNA FPS UNLOCKER Magic:</strong> Yeh device me <strong>Super-Smooth 60 FPS + Anti-Stutter Engine</strong> apply karega jisse combat freeze aur lag 100% khatam ho jata hai!<br><br>
          <button type="button" class="ai-jump-btn px-3 py-1.5 rounded-lg border theme-border text-emerald-400 font-bold hover:border-emerald-400 transition-colors" data-target="features">View Anti-Stutter Features →</button>`,
          chips: ['🔥 Fix Heating', '⚡ How to Install', '📥 Download APK']
        };
      }

      // ==========================================
      // D. COMMUNITY & DOWNLOAD
      // ==========================================
      if (['cipher leaks', 'developer', 'telegram', 'youtube', 'instagram', 'contact', 'email', 'owner', 'kisne banaya'].some(w => rawQ.includes(w))) {
        return {
          text: `👑 <strong>Official Community & Developer Links:</strong><br>
          APNA FPS UNLOCKER ko gaming community ke verified developer <strong>Cipher Leaks</strong> ne develop kiya hai.<br><br>
          • <strong>Telegram Community:</strong> <a href="https://t.me/+me0XThXEQJhiMTVl" target="_blank" class="text-cyan-400 underline font-bold">Join Official Channel</a> (Daily Updates & Guides)<br>
          • <strong>YouTube:</strong> <a href="https://www.youtube.com/@cipherleaks" target="_blank" class="text-red-400 underline font-bold">@cipherleaks</a> (Video Tutorials)<br>
          • <strong>Instagram:</strong> <a href="https://www.instagram.com/cipherleaks/" target="_blank" class="text-pink-400 underline font-bold">@cipherleaks</a><br>
          • <strong>Support Email:</strong> <code>shahbajbusiness@gmail.com</code>`,
          chips: ['🛒 Google Play Store', '📥 Download APK', '⚡ How to Install', '📱 Check Device']
        };
      }

      // Google Play Store Specific Query
      if (['play store', 'playstore', 'google play', 'store link', 'store se download', 'google store', 'play protect', 'package id'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'play_store';
        return {
          text: `🛒 <strong>Official Google Play Store Release:</strong><br>
          Haan! APNA FPS UNLOCKER ab <strong>Google Play Store</strong> par officially available hai:<br><br>
          • <strong>Direct 1-Tap Launch:</strong> Play Store app direct open karke 1 click me install karein.<br>
          • <strong>Google Play Protect Safe:</strong> 100% verified & safe from malware or ban risk.<br>
          • <strong>Auto Updates:</strong> Future BGMI & PUBG updates automatically sync honge.<br>
          • <strong>Package:</strong> <code>com.wildsoulfury.shahbaj</code><br><br>
          <a href="${live.playStoreUrl}" target="_blank" rel="noopener" data-dynamic="playstore-url" class="px-4 py-2 btn-playstore text-xs inline-flex items-center gap-2 rounded-lg font-bold shadow-lg mr-2 my-1">
            <span>🛒 Open Google Play Store →</span>
          </a>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" data-dynamic="download-url" class="px-3.5 py-2 btn-cyber-primary text-xs inline-block rounded-lg font-bold shadow-lg my-1">
            📥 Direct APK
          </a>`,
          chips: ['🛒 Google Play Store', '📥 Download APK', '⚡ How to Install', '🛡️ Anti-Ban Architecture']
        };
      }

      // Live Google Play Reviews & Ratings AI Query
      if (['review', 'rating', 'feedback', 'kya rating', 'stars', 'comments', 'public kya bolti', 'kaisa app', 'public review'].some(w => rawQ.includes(w))) {
        conversationContext.lastTopic = 'reviews';
        const stats = activeAppConfig.playStoreStats || DEFAULT_APP_CONFIG.playStoreStats;
        const downloads = stats.downloads || '100+';
        const reviewCount = (stats.reviews && stats.reviews.length) || 0;
        const ratingStr = stats.rating ? `${stats.rating} ★` : 'New Release';
        return {
          text: `⭐ <strong>Official Google Play Store Status:</strong><br>
          • <strong>Downloads:</strong> <span class="text-emerald-400 font-bold">${downloads}</span> Active Installs<br>
          • <strong>Rating:</strong> <span class="text-amber-400 font-bold">${ratingStr}</span> on Play Store<br>
          • <strong>Public Reviews:</strong> <span class="text-cyan-400 font-bold">${reviewCount} reviews</span><br><br>
          ${reviewCount === 0 ? 'Abhi tak Play Store par koi review submit nahi hua hai. Aap pehle verified gamer baniye jo apna 120 FPS experience share kare!' : 'Gamers ke live verified reviews niche section me live sync ho rahe hain.'}<br><br>
          <button type="button" class="ai-jump-btn text-xs text-amber-400 font-bold hover:underline" data-target="reviews">Read Live Reviews Wall On Page ↓</button>`,
          chips: ['🛒 Google Play Store', '📥 Download APK', '📱 Check Device', '🛡️ Anti-Ban Architecture']
        };
      }

      if (['download', 'apk', 'link', 'kaha se download', 'install link', 'update link'].some(w => rawQ.includes(w))) {
        return {
          text: `📥 <strong>Official APNA FPS UNLOCKER Download Options:</strong><br>
          Aap apni pasand ke anusar <strong>Google Play Store</strong> ya <strong>Direct Web APK</strong> dono se install kar sakte hain:<br><br>
          1. <strong>Google Play Store (Recommended):</strong><br>
          • 1-Tap direct install, Google Play Protect certified, automatic updates.<br>
          <a href="${live.playStoreUrl}" target="_blank" rel="noopener" data-dynamic="playstore-url" class="px-4 py-2 btn-playstore text-xs inline-flex items-center gap-2 rounded-lg font-bold shadow-md my-1.5">
            <span>🛒 Open Google Play Store →</span>
          </a><br><br>
          2. <strong>Direct Web APK (v${live.version}):</strong><br>
          • Fast direct mirror (~15 MB, zero ads, no Google login needed).<br>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" data-dynamic="download-url" class="px-4 py-2 btn-cyber-primary text-xs inline-block rounded-lg font-bold shadow-md my-1.5">
            <span>📥 Download Direct APK →</span>
          </a><br><br>
          <button type="button" class="ai-jump-btn text-xs text-cyan-400 font-bold hover:underline" data-target="download">View Comparison on Download Hub ↓</button>`,
          chips: ['🛒 Google Play Store', '📥 Download APK', '⚡ How to Install', '📱 Check Device']
        };
      }

      // Contextual Follow-up (If user asks follow-up about their remembered device)
      if (conversationContext.userDevice && ['isme', 'is phone me', 'mera phone', 'kya setting', 'kaise karein'].some(w => rawQ.includes(w))) {
        return {
          text: `📱 <strong>Follow-up for ${conversationContext.userDevice}:</strong><br>
          Aapke <strong>${conversationContext.userDevice}</strong> par best performance ke liye:<br>
          1. <strong>APNA FPS UNLOCKER</strong> se 120 FPS apply karein.<br>
          2. Game settings me <strong>Graphics: Smooth + Frame Rate: 120 FPS (Ultra Extreme)</strong> rakhein.<br>
          3. Phone ke Game Turbo me Touch Sensitivity ko maximum karein.<br><br>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" class="px-3 py-1 btn-cyber-primary text-xs inline-block rounded font-bold">Download APK</a>
          <button type="button" class="ai-jump-btn px-3 py-1 rounded border theme-border text-xs text-emerald-400 font-bold ml-2" data-target="processors">View Processor Settings →</button>`,
          chips: ['⚡ Shizuku Setup', '🔥 Fix Heating', '🛡️ Anti-Ban Architecture']
        };
      }

      // Smart Contextual Fallback with Section Navigator
      return {
        text: `💡 <strong>APNA AI Website Intelligence:</strong><br>
        Aapka sawal: <em>"${query}"</em><br><br>
        APNA FPS UNLOCKER Android 9 se 17 tak sabhi smartphones par BGMI 4.7 & PUBG Mobile me <strong>90 FPS & 120 FPS</strong> bina root ke unlock karne ke liye 100% tested hai.<br><br>
        Website ke direct sections explore karne ke liye tap karein:<br>
        • <button type="button" class="ai-jump-btn text-emerald-400 font-bold hover:underline" data-target="simulator">⚡ Try 120 FPS Motion Simulator</button><br>
        • <button type="button" class="ai-jump-btn text-emerald-400 font-bold hover:underline" data-target="processors">📱 Check Processor FPS Matrix</button><br>
        • <button type="button" class="ai-jump-btn text-emerald-400 font-bold hover:underline" data-target="safety">🛡️ Anti-Ban Safety Architecture</button><br>
        • <button type="button" class="ai-jump-btn text-emerald-400 font-bold hover:underline" data-target="specs">📊 App Technical Specifications</button><br>
        • <button type="button" class="ai-jump-btn text-emerald-400 font-bold hover:underline" data-target="faq">❓ 10 Frequently Asked Questions</button>`,
        chips: ['📱 Check Device', '⚡ 120 FPS Simulator', '🛡️ Anti-Ban Architecture', '📖 Step-by-Step Guide', '📥 Download APK']
      };
    };

    const handleUserQuery = (query) => {
      if (!query) return;
      appendAIMessage(query, true);

      // Typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'flex gap-2 items-center text-xs theme-text-muted italic px-2 animate-pulse';
      typingDiv.innerHTML = '<span>🤖 APNA AI is reading website content...</span>';
      aiChatMessages.appendChild(typingDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

      setTimeout(() => {
        typingDiv.remove();
        const res = processWebsiteAwareAIQuery(query);
        appendAIMessage(res.text, false);
        if (res.chips && res.chips.length > 0) {
          renderFollowUpChips(res.chips);
        }
      }, 350);
    };

    if (aiChatForm && aiChatInput) {
      aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = aiChatInput.value.trim();
        if (!query) return;
        aiChatInput.value = '';
        handleUserQuery(query);
      });
    }

    // Initial follow up chips
    renderFollowUpChips(['🛒 Google Play Store', '★ Real Player Reviews', '📱 Check Device', '⚡ 120 FPS Simulator', '🛡️ Anti-Ban Architecture']);
  }

  // ==========================================
  // 12. HERO LIVE PULSING FPS HUD
  // ==========================================
  const initHeroLiveFps = () => {
    const el = document.getElementById('liveHeroFpsVal');
    if (!el) return;
    const fpsStates = ['120.0 FPS', '119.8 FPS', '120.0 FPS', '119.9 FPS', '120.0 FPS', '119.7 FPS'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % fpsStates.length;
      el.textContent = fpsStates[idx];
    }, 2200);
  };
  initHeroLiveFps();

  // ==========================================
  // 13. INTERACTIVE SCREENSHOTS SHOWCASE
  // ==========================================
  const initScreenshotShowcase = () => {
    const tabBtns = document.querySelectorAll('.screenshot-tab-btn');
    const thumbBtns = document.querySelectorAll('.quick-thumb-btn');
    const mainImg = document.getElementById('activeScreenshotImg');
    const mainLink = document.getElementById('activeScreenshotLink');
    const mainTitle = document.getElementById('activeScreenshotTitle');
    const mainTag = document.getElementById('activeScreenshotTag');

    const switchScreenshot = (imgSrc, title, tag, targetBtn) => {
      if (!mainImg || !imgSrc) return;
      mainImg.style.opacity = '0.35';
      setTimeout(() => {
        mainImg.src = imgSrc;
        if (mainLink) {
          mainLink.href = imgSrc;
          mainLink.setAttribute('data-full', imgSrc);
        }
        if (mainTitle && title) mainTitle.textContent = title;
        if (mainTag && tag) mainTag.textContent = tag;
        mainImg.style.opacity = '1';
      }, 150);

      tabBtns.forEach(btn => btn.classList.remove('active'));
      if (targetBtn && targetBtn.classList.contains('screenshot-tab-btn')) {
        targetBtn.classList.add('active');
      } else {
        tabBtns.forEach(b => {
          if (b.getAttribute('data-img') === imgSrc) b.classList.add('active');
        });
      }
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.getAttribute('data-img');
        const title = btn.getAttribute('data-title');
        const tag = btn.getAttribute('data-tag');
        switchScreenshot(img, title, tag, btn);
      });
    });

    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.getAttribute('data-img');
        const title = btn.getAttribute('data-title');
        const tag = btn.getAttribute('data-tag');
        switchScreenshot(img, title, tag, null);
      });
    });
  };
  initScreenshotShowcase();

  // ==========================================
  // 14. INTERACTIVE PHONE & PROCESSOR COMPATIBILITY SEARCH ENGINE
  // ==========================================
  const initDeviceSearchEngine = () => {
    const input = document.getElementById('deviceSearchInput');
    const container = document.getElementById('deviceSearchResult');
    const clearBtn = document.getElementById('clearSearchBtn');
    const quickChips = document.querySelectorAll('.quick-chip');

    if (!container) return;

    const DEVICES_DB = [
      {
        names: ['poco x6 pro', 'poco x6', 'redmi k70e', 'dimensity 8300', '8300 ultra', 'poco'],
        title: 'Poco X6 Pro / Dimensity 8300 Ultra',
        fps: '120 FPS',
        status: 'Verified 120 FPS Locked',
        graphics: 'Smooth + 120 FPS (Ultra Extreme)',
        temp: '37.5°C Average Hot Drops',
        gyro: '8.3ms Frametime Pacing',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'Native 120Hz CrystalRes Flow AMOLED panel supported with zero throttling via Shizuku Service.'
      },
      {
        names: ['oneplus 12r', 'oneplus 11r', 'oneplus 12', 'oneplus 11', 'oneplus', 'snapdragon 8 gen 2', '8 gen 2'],
        title: 'OnePlus 12R / 11R (Snapdragon 8 Gen 2 / 8+ Gen 1)',
        fps: '120 FPS',
        status: 'Verified 120 FPS Locked',
        graphics: 'Smooth + 120 FPS (HDR Supported)',
        temp: '36.8°C Dual Cryo-Velocity',
        gyro: 'Instant 8.3ms Gyro Combat',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'OxygenOS 14 display refresh rate lock auto-synchronized via SurfaceFlinger API.'
      },
      {
        names: ['iqoo neo 9 pro', 'iqoo neo 7 pro', 'iqoo 12', 'iqoo z9', 'iqoo', 'neo 9', 'snapdragon 8 gen 3', '8 gen 3'],
        title: 'iQOO Neo 9 Pro / iQOO 12 (Snapdragon 8 Gen 2/3)',
        fps: '120 / 144 FPS',
        status: 'Verified 120 / 144 FPS',
        graphics: 'Smooth + 120 FPS / Super Resolution',
        temp: '38.2°C Hot Drops Stable',
        gyro: 'Ultra-Fast 3000Hz Instant Touch',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'Supercomputing chip frame interpolation natively synced with zero input lag.'
      },
      {
        names: ['realme gt 6t', 'realme gt 6', 'realme gt neo', 'realme', 'gt 6t', 'snapdragon 7+ gen 3'],
        title: 'Realme GT 6T / GT 6 (Snapdragon 7+ Gen 3 / 8s Gen 3)',
        fps: '120 FPS',
        status: 'Verified 120 FPS Locked',
        graphics: 'Smooth + 120 FPS (Extreme+)',
        temp: '37.0°C Iceberg Vapor Chamber',
        gyro: '8.3ms Touch Gyroscope',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'Realme UI 5.0 screen auto-throttle bypassed safely without root.'
      },
      {
        names: ['redmi note 13 pro+', 'redmi note 13 pro', 'redmi note 12 pro', 'redmi note 13', 'redmi', 'dimensity 7200'],
        title: 'Redmi Note 13 Pro+ / Dimensity 7200 Ultra',
        fps: '90 & 120 FPS',
        status: 'Supported (90 / 120 FPS)',
        graphics: 'Smooth + 90 FPS / 120 FPS',
        temp: '38.5°C Sustained Load',
        gyro: 'Fast Gyro Tracking',
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        note: 'Recommended: Smooth + 90 FPS for competitive ranked battery endurance.'
      },
      {
        names: ['poco f6', 'xiaomi 14 civi', 'snapdragon 8s gen 3', '8s gen 3', 'poco f5'],
        title: 'Poco F6 / Xiaomi 14 Civi (Snapdragon 8s Gen 3)',
        fps: '120 FPS',
        status: 'Verified 120 FPS Locked',
        graphics: 'Smooth + 120 FPS (Ultra Extreme)',
        temp: '37.8°C Hot Drops Tested',
        gyro: 'Ultra-Low 8.3ms Response',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'Adreno 735 GPU renders true 120 FPS with zero frame pacing jitter.'
      },
      {
        names: ['helio g99', 'helio g96', 'helio g95', 'redmi 12', 'infinix note 30', 'infinix', 'poco m5', 'g99'],
        title: 'MediaTek Helio G99 / G96 (Budget Gaming Phones)',
        fps: '60 & 90 FPS',
        status: 'Supported (Smooth 60/90 FPS)',
        graphics: 'Smooth + 60 FPS (90 FPS on 90Hz Displays)',
        temp: '36.5°C Ultra-Low Power',
        gyro: 'Clean Gyro Aiming',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        note: 'Hardware limits max refresh to 90Hz. Unlocks maximum possible stable FPS.'
      },
      {
        names: ['samsung s24', 'samsung s23', 's24 ultra', 's23 ultra', 'galaxy s23', 'galaxy s24', 'samsung'],
        title: 'Samsung Galaxy S24 / S23 Series (Snapdragon 8 Gen 3 for Galaxy)',
        fps: '120 FPS',
        status: 'Verified 120 FPS Dynamic Sync',
        graphics: 'Smooth + 120 FPS',
        temp: '37.2°C Steady Combat',
        gyro: 'Dynamic AMOLED 2X 120Hz Locked',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'One UI 6.1 game optimizing service (GOS) throttling safely bypassed.'
      }
    ];

    const renderDeviceCard = (device) => {
      const playUrl = activeAppConfig.playStoreUrl || DEFAULT_APP_CONFIG.playStoreUrl;
      container.innerHTML = `
        <div class="device-result-box glass-panel rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b theme-border">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${device.badge} mb-2">
                <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                ${device.status}
              </div>
              <h3 class="font-gaming text-xl sm:text-2xl font-black theme-text-primary">
                ${device.title}
              </h3>
            </div>
            <div class="text-left sm:text-right flex-shrink-0">
              <div class="font-gaming text-3xl sm:text-4xl font-black text-emerald-400">
                ${device.fps}
              </div>
              <div class="text-[11px] theme-text-muted font-bold uppercase tracking-wider">
                Max Unlockable FPS
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-5 border-b theme-border text-xs">
            <div class="p-3.5 rounded-xl theme-bg-primary border theme-border">
              <span class="theme-text-muted block mb-1 font-semibold">Recommended Settings</span>
              <span class="theme-text-primary font-bold font-heading text-sm">${device.graphics}</span>
            </div>
            <div class="p-3.5 rounded-xl theme-bg-primary border theme-border">
              <span class="theme-text-muted block mb-1 font-semibold">Touch / Gyro Response</span>
              <span class="text-cyan-400 font-bold font-heading text-sm">${device.gyro}</span>
            </div>
            <div class="p-3.5 rounded-xl theme-bg-primary border theme-border">
              <span class="theme-text-muted block mb-1 font-semibold">Hot Drops Battery Temp</span>
              <span class="text-emerald-400 font-bold font-heading text-sm">${device.temp}</span>
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p class="text-xs theme-text-secondary leading-relaxed max-w-md">
              💡 <strong class="theme-text-primary">Gamer Note:</strong> ${device.note}
            </p>
            <a href="${playUrl}" target="_blank" rel="noopener noreferrer" data-dynamic="playstore-url" class="btn-playstore px-5 py-2.5 text-xs font-bold whitespace-nowrap shadow-md">
              <span>Install on Play Store →</span>
            </a>
          </div>
        </div>
      `;
    };

    const searchDevice = (query) => {
      const cleanQ = (query || '').toLowerCase().trim();
      if (!cleanQ) {
        renderDeviceCard(DEVICES_DB[0]);
        if (clearBtn) clearBtn.classList.add('hidden');
        return;
      }

      if (clearBtn) clearBtn.classList.remove('hidden');

      // Check DB match
      for (const item of DEVICES_DB) {
        for (const name of item.names) {
          if (cleanQ.includes(name) || name.includes(cleanQ)) {
            renderDeviceCard(item);
            return;
          }
        }
      }

      // Universal Fallback Card
      renderDeviceCard({
        title: `Custom Device (${cleanQ.toUpperCase()})`,
        fps: '90 & 120 FPS',
        status: 'Supported via Android Display API',
        graphics: 'Smooth + 90 FPS / 120 FPS',
        temp: 'Optimized by Zero-Thermal Engine',
        gyro: '8.3ms Synchronized Pacing',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        note: 'Aapka device Android 9 se 17 ke standard SurfaceFlinger API ke through 100% compatible hai bina phone ko root kiye.'
      });
    };

    // Initial default view
    renderDeviceCard(DEVICES_DB[0]);

    if (input) {
      input.addEventListener('input', (e) => {
        searchDevice(e.target.value);
      });
    }

    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        searchDevice('');
      });
    }

    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const dev = chip.getAttribute('data-device') || '';
        if (input) input.value = dev;
        searchDevice(dev);
      });
    });
  };
  initDeviceSearchEngine();

  // ==========================================
  // 15. INTERACTIVE SEO TAG CHIPS CONTROLLER
  // ==========================================
  const initSeoTagChips = () => {
    const tagChips = document.querySelectorAll('.seo-tag-chip');
    const devInput = document.getElementById('deviceSearchInput');
    const compatSection = document.getElementById('compatibility');
    const updateSection = document.getElementById('update-guide');

    tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const rawTag = (chip.getAttribute('data-tag') || chip.textContent || '').toLowerCase().trim();
        const cleanTag = rawTag.replace(/[#🏷️🔥]/g, '').trim();

        // Brand & Hardware Device Tags -> Jump to Device Compatibility Engine
        const brandKeywords = ['poco', 'xiaomi', 'redmi', 'oneplus', 'iqoo', 'vivo', 'oppo', 'realme', 'samsung', 'infinix', 'snapdragon', 'dimensity'];
        const matchedBrand = brandKeywords.find(b => cleanTag.includes(b));

        if (matchedBrand) {
          if (compatSection) {
            compatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (devInput) {
            devInput.value = cleanTag;
            devInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => devInput.focus(), 500);
          }
          return;
        }

        // 4.7 Update & Stutter Fix Tags -> Jump to 4.7 Update Guide
        const guideKeywords = ['4.7', 'stuck', 'freeze', 'angle preferences', 'routine repair', 'resource download', 'drop', 'lag', 'no root', 'shizuku'];
        const matchedGuide = guideKeywords.find(g => cleanTag.includes(g));

        if (matchedGuide) {
          if (updateSection) {
            updateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        // Default fallback -> Smooth scroll to Update Guide
        if (updateSection) {
          updateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };
  initSeoTagChips();

});
