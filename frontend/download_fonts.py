import os
import re
import requests

font_dir = "public/assets/fonts"
os.makedirs(font_dir, exist_ok=True)

# Google Fonts URL requesting modern WOFF2 formats
google_fonts_url = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Libre+Caslon+Display&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Space+Grotesk:wght@300..700&display=swap"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print("Fetching Google Fonts stylesheet...")
r = requests.get(google_fonts_url, headers=headers)
css_content = r.text

with open(os.path.join(font_dir, 'fonts.css'), 'w') as f:
    f.write(css_content)

# Extract woff2 URLs
urls = re.findall(r'url\((https://fonts.gstatic.com/[^)]+\.woff2)\)', css_content)
# deduplicate urls
urls = list(set(urls))
print(f"Found {len(urls)} woff2 font files to download.")

for i, url in enumerate(urls):
    filename = url.split('/')[-1]
    filepath = os.path.join(font_dir, filename)
    print(f"Downloading [{i+1}/{len(urls)}]: {filename}")
    font_data = requests.get(url).content
    with open(filepath, 'wb') as f:
        f.write(font_data)

print("All fonts downloaded successfully!")

# Also replace the remote urls in fonts.css with local filenames
local_css = css_content
for url in urls:
    filename = url.split('/')[-1]
    local_css = local_css.replace(url, f'/assets/fonts/{filename}')

with open(os.path.join(font_dir, 'fonts_local.css'), 'w') as f:
    f.write(local_css)

print("fonts_local.css generated!")
