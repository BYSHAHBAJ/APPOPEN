// APNA FPS BOOSTER — website interactions
// Keep interactions isolated so missing optional elements cannot stop the rest of the page.

(() => {
  const menuToggle = document.getElementById('menuToggle');
  const navlinks = document.getElementById('navlinks');

  if (menuToggle && navlinks) {
    menuToggle.addEventListener('click', () => {
      const open = navlinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuToggle.textContent = open ? '✕' : '☰';
    });

    navlinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navlinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Screenshot preview (the screenshot links remain usable without JavaScript).
  const imageLightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  if (imageLightbox && lightboxImage && lightboxClose) {
    document.querySelectorAll('.image-preview').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (typeof imageLightbox.showModal !== 'function') return;
        const image = link.querySelector('img');
        if (!image) return;
        event.preventDefault();
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || 'Screenshot preview';
        imageLightbox.showModal();
      });
    });

    lightboxClose.addEventListener('click', () => imageLightbox.close());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && imageLightbox.open) imageLightbox.close();
    });
    imageLightbox.addEventListener('click', (event) => {
      if (event.target === imageLightbox) imageLightbox.close();
    });
    imageLightbox.addEventListener('close', () => { lightboxImage.src = ''; });
  }

  // Theme: system preference by default; an explicit visitor choice persists locally.
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const icon = toggle.querySelector('.theme-icon');
    const systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    let saved = null;
    try { saved = localStorage.getItem('apnafps-theme'); } catch (_) {}

    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);
      const dark = theme === 'dark';
      if (icon) icon.textContent = dark ? '☀' : '☾';
      toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    };

    applyTheme(saved === 'dark' || saved === 'light' ? saved : (systemDark && systemDark.matches ? 'dark' : 'light'));
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('apnafps-theme', next); } catch (_) {}
    });

    if (systemDark) {
      const onSystemChange = (event) => {
        let manual = null;
        try { manual = localStorage.getItem('apnafps-theme'); } catch (_) {}
        if (manual !== 'dark' && manual !== 'light') applyTheme(event.matches ? 'dark' : 'light');
      };
      if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
      else if (systemDark.addListener) systemDark.addListener(onSystemChange);
    }
  }


  // Seamless auto-scroll for the compact preview strip. Reuses existing image URLs.
  const previewTrack = document.getElementById('topPreviewTrack');
  const previewWindow = document.getElementById('topPreviewWindow');
  if (previewTrack && previewWindow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const originals = Array.from(previewTrack.children);
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      clone.querySelectorAll('img').forEach((img) => { img.alt = ''; img.loading = 'lazy'; });
      previewTrack.appendChild(clone);
    });
    // Keep the animation seamless if the visitor resizes the browser.
    const refreshPreviewAnimation = () => {
      previewTrack.style.animation = 'none';
      void previewTrack.offsetWidth;
      previewTrack.style.animation = '';
    };
    window.addEventListener('resize', refreshPreviewAnimation, { passive: true });
  }
})();
