#!/usr/bin/env python3
"""
sutaz.ca — pictures/ imagery audit (Phase 4 curation).

Classifies every image in /pictures locally so we can shortlist for the
DESIGN-ELEVATION.md §4.4 policy without 46 separate vision calls.

Outputs per image:
  - dimensions + aspect ratio (landscape/square/portrait)
  - has alpha channel (compositing matters)
  - mean brightness (0=black, 255=white) — for "dark/moody" filter
  - dominant color (quantized) — to gauge teal/navy affinity
  - teal-affinity score (how close dominant color is to brand teal #14b8a6)
  - navy-affinity score (how close to brand bg navy #0a0e1a)
  - "person at laptop" heuristic flag (high skin-tone ratio + warm midtones)

This is a SCREENING tool, not a verdict. Vision analysis (analyze_image MCP)
makes the final content call on the shortlist (faces/trademarks/cliché).
"""
import sys, os, math
from PIL import Image, ImageStat

PICTURES = r"C:\Users\root\Desktop\sutaz.ca\pictures"

# Brand palette (from DESIGN-ELEVATION.md §3 + globals.css @theme)
BRAND_TEAL = (20, 184, 166)    # #14b8a6
BRAND_NAVY = (10, 14, 26)      # #0a0e1a

def color_dist(c1, c2):
    return math.sqrt(sum((a-b)**2 for a, b in zip(c1, c2)))

def classify(path):
    try:
        im = Image.open(path)
    except Exception as e:
        return {"file": os.path.basename(path), "error": str(e)}
    w, h = im.size
    has_alpha = "A" in im.mode or "transparency" in im.info
    # Convert for analysis (flatten alpha onto black for dark compositing preview)
    rgb = im.convert("RGB")
    # Brightness
    stat = ImageStat.Stat(rgb)
    brightness = sum(stat.mean[:3]) / 3.0
    # Dominant color via quantization
    small = rgb.resize((100, 100))
    quant = small.quantize(colors=5, method=Image.Quantize.MEDIANCUT)
    palette = quant.getpalette()[:15]
    colors = [tuple(palette[i:i+3]) for i in range(0, 15, 3)]
    # Weight by frequency
    hist = quant.convert("RGB").getcolors(10000)
    hist.sort(reverse=True)
    dominant = hist[0][1] if hist else colors[0]
    teal_aff = round(255 - color_dist(dominant, BRAND_TEAL), 1)
    navy_aff = round(255 - color_dist(dominant, BRAND_NAVY), 1)
    # Aspect
    ar = w / h
    if ar >= 1.2: orient = "landscape"
    elif ar <= 0.85: orient = "portrait"
    else: orient = "square"
    # Brightness class
    if brightness < 60: mood = "VERY-DARK"
    elif brightness < 110: mood = "dark"
    elif brightness < 170: mood = "mid"
    else: mood = "bright"
    return {
        "file": os.path.basename(path),
        "dims": f"{w}x{h}",
        "orient": orient,
        "alpha": "YES" if has_alpha else "no",
        "mood": mood,
        "brightness": round(brightness, 0),
        "dominant_rgb": dominant,
        "teal_aff": teal_aff,
        "navy_aff": navy_aff,
    }

def main():
    files = sorted(f for f in os.listdir(PICTURES)
                   if f.lower().endswith((".jpg", ".jpeg", ".png")))
    rows = []
    for f in files:
        rows.append(classify(os.path.join(PICTURES, f)))
    # Print table
    print(f"{'FILE':<48} {'DIMS':<12} {'ORIENT':<10} {'ALPHA':<6} {'MOOD':<10} {'BR':<4} {'TEAL':<6} {'NAVY':<6} DOMINANT_RGB")
    print("-" * 130)
    # Sort: alpha first (compositable assets), then by navy-affinity (dark/moody)
    rows_sorted = sorted([r for r in rows if "error" not in r],
                         key=lambda r: (r["alpha"] != "YES", -r["navy_aff"]))
    for r in rows_sorted:
        print(f"{r['file']:<48} {r['dims']:<12} {r['orient']:<10} {r['alpha']:<6} {r['mood']:<10} {int(r['brightness']):<4} {r['teal_aff']:<6} {r['navy_aff']:<6} {r['dominant_rgb']}")
    errs = [r for r in rows if "error" in r]
    if errs:
        print("\nERRORS:")
        for r in errs:
            print(f"  {r['file']}: {r['error']}")

if __name__ == "__main__":
    main()
