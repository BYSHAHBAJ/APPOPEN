APNA FPS BOOSTER — GitHub Pages flat-file package (dark theme consistency v5)

Upload index.html, style.css, and main.js directly to the ROOT of your GitHub repository.
This update adds a final dark-theme CSS pass for common cards, CTA panels, tables, FAQ,
forms, headings, body text, and other elements that can otherwise retain white backgrounds.
The light theme and saved device/manual preference remain supported.
Keep existing image/media files. After GitHub Pages deploys, hard-refresh with Ctrl+Shift+R.
If the live page is /index-new, update that HTML page too if it is a separate file.

Targeted fix: dark mode now explicitly styles the FPS options strip and FPS comparison table, including table headers/cells that previously retained pale backgrounds with pale text.
