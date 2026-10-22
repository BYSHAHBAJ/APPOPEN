APNA FPS BOOSTER — GitHub Pages flat-file package (Dark/Light mode)

Upload these files directly to the ROOT of your GitHub repository:
- index.html
- style.css
- main.js

The page references /style.css and /main.js on your domain. Do not place these files inside a new folder.
Theme behavior:
- First visit follows the device/browser dark or light preference.
- The moon/sun button in the header lets visitors switch manually.
- Manual preference is saved in localStorage on that device/browser.
To reset to device-following behavior, clear the site's local storage key `apnafps-theme`.
Keep existing image/media files in their current paths. This package does not include those assets.
After GitHub Pages deploys, hard-refresh with Ctrl+Shift+R.
If the live page is /index-new, update that page's HTML too so it includes the theme toggle and /style.css + /main.js references.
