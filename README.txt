APNA FPS BOOSTER — Android Mobile Width Fix

This is a CSS-only patch for the existing GitHub root-file website.

1. Replace the current root style.css with the style.css in this package.
2. Keep index.html and main.js unchanged.
3. Confirm index.html loads /style.css (or the same stylesheet path used by your site).
4. Wait for GitHub Pages deployment, then clear browser cache / hard refresh.

The patch constrains the page and common layout children to the mobile viewport, allows grid/flex children to shrink, and preserves intentional horizontal scrolling only for wide tables.

Note: The supplied screenshots show the symptom, but I cannot verify the live page in a real Android browser from this CSS-only package. If a specific element still overflows, inspect that element's computed width in DevTools.
