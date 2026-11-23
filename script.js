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


  // ==========================================
  // 12. APNA GAMING AI ASSISTANT (WEBSITE-AWARE ULTIMATE AI ENGINE v3.5)
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
        renderFollowUpChips(['📱 Check Device', '⚡ 120 FPS Simulator', '🛡️ Anti-Ban Architecture', '📖 Step-by-Step Guide', '📊 System Specs']);
      });
    }

    const renderFollowUpChips = (chipList) => {
      if (!aiChipsContainer) return;
      aiChipsContainer.innerHTML = chipList.map(text => `
        <button type="button" class="ai-chip px-2.5 py-1 rounded-full border theme-border hover:border-emerald-400 hover:text-emerald-400 transition-colors">${text}</button>
      `).join('');

      aiChipsContainer.querySelectorAll('.ai-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawText = btn.textContent.replace(/[📱⚡🛡️📥🔥🎮💡🔧📖📊📸❓🍎]/g, '').trim();
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
        users: document.querySelector('.counter-val[data-target="53000"]')?.textContent || '53,000+',
        rating: document.querySelector('.counter-val[data-target="4.9"]')?.textContent || '4.9 ★',
        version: activeAppConfig.version || '4.7.0',
        apkUrl: activeAppConfig.apkUrl || 'https://github.com/APPOPEN/associated-domains/releases/download/v1.0.0/APNA-FPS-UNLOCKER.apk'
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
          • <strong>53,000+ active players</strong> daily use kar rahe hain aur 0 ban rate hai!<br><br>
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
          chips: ['📥 Download APK', '⚡ How to Install', '📱 Check Device']
        };
      }

      if (['download', 'apk', 'link', 'kaha se download', 'install link', 'update link'].some(w => rawQ.includes(w))) {
        return {
          text: `📥 <strong>Official APNA FPS UNLOCKER Download:</strong><br>
          • <strong>Live Version:</strong> <span data-dynamic="version">v${live.version}</span> (Fastly/GitHub CDN Synced)<br>
          • <strong>Compatibility:</strong> Android 9.0 se lekar Android 17 tak<br>
          • <strong>Package:</strong> 100% Virus-Free, Zero Ads, Direct APK<br><br>
          <a href="${live.apkUrl}" target="_blank" rel="noopener" class="px-4 py-2 btn-cyber-primary text-xs inline-block rounded-lg font-bold shadow-lg">Download Official APK Now →</a><br><br>
          <button type="button" class="ai-jump-btn text-xs theme-text-muted hover:text-emerald-400 underline" data-target="specs">View Full Specs Table →</button>`,
          chips: ['⚡ How to Install', '🛡️ Anti-Ban Architecture', '📱 Check Device']
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
    renderFollowUpChips(['📱 Check Device', '⚡ 120 FPS Simulator', '🛡️ Anti-Ban Architecture', '📖 Step-by-Step Guide', '📊 System Specs']);
  }

});
