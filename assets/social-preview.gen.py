#!/usr/bin/env python3
"""
Regenerate social-preview.png (1280x640) from the canonical DreamerOS mark.

This is the retained source for the brand card so future regenerations do not
drift. Run: python3 social-preview.gen.py  (needs Pillow + the Outfit font).

Spec:
  - canvas:     1280 x 640, brand near-black #05070d
  - mark:       mark.png (the canonical DreamerOS rainbow fingerprint),
                screen-composited so its black field disappears
  - wordmark:   Outfit (geometric); no new naming or tagline beyond the
                existing product name and one-line description
"""
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageFilter
import os

W, H = 1280, 640
card = Image.new("RGB", (W, H), (5, 7, 13))

def load(size, weight=700):
    p = os.environ.get("OUTFIT_TTF", "/tmp/Outfit.ttf")
    if os.path.exists(p):
        f = ImageFont.truetype(p, size)
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
        return f
    fb = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
    return ImageFont.truetype(fb, size)

f_eyebrow, f_title, f_tag, f_foot = load(28, 700), load(104, 800), load(34, 500), load(24, 500)

# top rainbow rule (the brand ridge gradient)
stops = [(59,130,246),(139,92,246),(236,72,153),(245,158,11),(16,185,129),(59,130,246)]
lerp = lambda a, b, t: tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))
bar = Image.new("RGB", (W, 6))
for x in range(W):
    seg = x/(W-1)*(len(stops)-1); i = int(seg); t = seg-i
    bar.putpixel((x, 0), lerp(stops[i], stops[min(i+1, len(stops)-1)], t))
card.paste(bar.resize((W, 6)), (0, 0))

# soft glow behind the mark
glow = Image.new("RGB", (W, H), (0, 0, 0))
ImageDraw.Draw(glow).ellipse([760, 80, 1240, 560], fill=(20, 40, 70))
card = ImageChops.screen(card, glow.filter(ImageFilter.GaussianBlur(120)))

# the real fingerprint mark, screen-blended onto the canvas
mark = Image.open("mark.png").convert("RGB")
th = 600; tw = int(mark.width * th / mark.height)
mark = mark.resize((tw, th), Image.LANCZOS)
layer = Image.new("RGB", (W, H), (0, 0, 0))
layer.paste(mark, (1205 - tw, (H - th)//2))
card = ImageChops.screen(card, layer)

d = ImageDraw.Draw(card)
def spaced(x, y, s, f, fill, ls):
    cx = x
    for ch in s:
        d.text((cx, y), ch, font=f, fill=fill); cx += d.textlength(ch, font=f) + ls
spaced(92, 150, "OPEN CONNECTOR PLATFORM", f_eyebrow, (45, 212, 191), 6)
d.text((88, 196), "DreamerOS", font=f_title, fill=(244, 246, 251))
d.text((88, 316), "Connectors", font=f_title, fill=(198, 206, 222))
d.text((92, 452), "Build governed integrations for DreamerOS.", font=f_tag, fill=(139, 149, 167))
d.text((92, 556), "github.com/gbude-sudo/DreamerOS-Live-", font=f_foot, fill=(92, 102, 120))
mit = "MIT licensed"
d.text((1188 - d.textlength(mit, font=f_foot), 556), mit, font=f_foot, fill=(92, 102, 120))

card.save("social-preview.png")
print("wrote social-preview.png", card.size)
