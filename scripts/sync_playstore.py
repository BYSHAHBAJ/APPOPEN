import os
import re
import json
import urllib.request

PACKAGE_NAME = "com.wildsoulfury.shahbaj"
PLAY_STORE_URL = f"https://play.google.com/store/apps/details?id={PACKAGE_NAME}&hl=en&gl=US"
JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "json", "update.json")

def sync():
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(PLAY_STORE_URL, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching Play Store: {e}")
        return False

    # Extract downloads
    dl_match = re.search(r'<div class="ClM7O">([^<]+)</div>\s*<div class="g1rdde">Downloads</div>', html)
    if not dl_match:
        dl_match = re.search(r'([0-9\.,]+[KkMmBb\+]*)\s*Downloads', html, re.IGNORECASE)
    
    downloads = dl_match.group(1).strip() if dl_match else "100+"

    # Extract rating
    rt_match = re.search(r'aria-label="Rated ([0-9\.]+) stars out of five stars"', html)
    rating = float(rt_match.group(1)) if rt_match else 4.4

    # Extract reviews count
    rc_match = re.search(r'([0-9,]+)\s*reviews', html, re.IGNORECASE)
    rating_count = int(rc_match.group(1).replace(',', '')) if rc_match else 12

    print(f"Fetched Play Store data: Downloads={downloads}, Rating={rating}, RatingCount={rating_count}")

    if not os.path.exists(JSON_PATH):
        print(f"File not found: {JSON_PATH}")
        return False

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    changed = False
    if "playStoreStats" not in config:
        config["playStoreStats"] = {}
        changed = True

    if config["playStoreStats"].get("downloads") != downloads:
        print(f"Updating downloads: {config['playStoreStats'].get('downloads')} -> {downloads}")
        config["playStoreStats"]["downloads"] = downloads
        changed = True

    if config["playStoreStats"].get("rating") != rating:
        print(f"Updating rating: {config['playStoreStats'].get('rating')} -> {rating}")
        config["playStoreStats"]["rating"] = rating
        changed = True

    if changed:
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
        print("update.json successfully updated with latest Play Store stats!")
    else:
        print("No changes needed in update.json.")

    return changed

if __name__ == "__main__":
    sync()
