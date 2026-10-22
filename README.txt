APNA FPS BOOSTER — GitHub Pages dark-mode deep audit patch v6

Files are flat: upload index.html, style.css, and main.js directly into the repository root.
This patch was built after auditing the current HTML classes and CSS. It explicitly addresses
the actual FPS strip, FPS comparison table, feature/game cards, FAQ, guide/TOC/steps blocks,
download panels, section labels, lightbox, mobile navigation, form controls, and footer.
The dark selectors support data-theme on either <html> or <body>. Existing media assets stay
unchanged. After deploying, hard-refresh with Ctrl+Shift+R. The current browser route shown
in the screenshots is /index-new; ensure that page loads this same style.css file.
