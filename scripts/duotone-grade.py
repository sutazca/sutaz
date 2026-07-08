#!/usr/bin/env python3
"""
sutaz.ca — section imagery grade + encode pass (v3 cinematic redesign).

Curates a small set of engineering/automation tech photos from the shared
pictures library, grades each to the teal-navy brand palette, and emits
lightweight WebP variants (quality 72, max-width 1920px, target <=300KB) into
public/sections/ under the section slot names the components reference.

VERIFIED TECHNIQUE (checked against official Pillow docs,
pillow.readthedocs.io/en/stable/reference/ImageOps.html):
  ImageOps.colorize() requires a GRAYSCALE ("L") source. It maps luminance to a
  3-color (black -> mid -> white) wedge. Pipeline for a COLOR photo:
      1. downscale so the long edge is <= MAX_WIDTH (WebP stays small)
      2. convert to grayscale ("L")
      3. mild contrast lift so highlights survive the navy shadow map
      4. colorize(gray, black=NAVY, mid=<desaturated slate>, white=TEAL)
      5. pull saturation back so it reads muted/cinematic, not neon
      6. save as WebP q72

Palette (mirrors globals.css @theme):
  shadows   -> navy  #0a0e1a  (10, 14, 26)
  midtones  -> desaturated slate-blue, slightly cool
  highlights -> teal #14b8a6  (20, 184, 166)

Idempotent + safe: sources are read-only; only public/sections/*.webp is written.
"""
import os

from PIL import Image, ImageEnhance, ImageOps

# Source library (read-only) and output dir.
SOURCE = "/home/ai/mnt/nas/docker/sutazca/pictures"
OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "sections",
)

MAX_WIDTH = 1920
WEBP_QUALITY = 72

# Brand palette (mirrors globals.css @theme).
NAVY = (10, 14, 26)        # #0a0e1a — shadows
TEAL = (20, 184, 166)      # #14b8a6 — highlights
MID = (48, 60, 90)         # desaturated slate-blue midtone (cool, on-brand)

# Section slot -> source image. Curated for an engineering/automation brand:
# circuit boards, code, data-center, abstract 3D. An image may repeat across
# slots when a fit is scarce.
SLOT_TO_SOURCE = {
    "stats-graded.webp": "adi-goldstein-EUsVwEOsblE-unsplash.jpg",       # teal circuit board
    "problem-solution-graded.webp": "kevin-ku-w7ZyuGYNpRQ-unsplash.jpg",  # code on screen
    "how-we-build-graded.webp": "pexels-brett-sayles-4508751.jpg",        # data center racks
    "ecosystems-graded.webp": "pexels-brett-sayles-4497195.jpg",          # data center aisle
    "atmosphere-graded.webp": "javier-miranda-MrWOCGKFVDg-unsplash.jpg",  # abstract 3D orb
    "final-cta-graded.webp": "pexels-thisisengineering-3861943.jpg",      # engineering workstation
    "deep-space-graded.webp": "javier-miranda-MrWOCGKFVDg-unsplash.jpg",  # abstract 3D orb (error/404)
}


def grade(src_path: str, out_path: str) -> dict:
    im = Image.open(src_path).convert("RGB")
    # 1. downscale so the long edge is <= MAX_WIDTH
    if im.width > MAX_WIDTH:
        ratio = MAX_WIDTH / im.width
        im = im.resize((MAX_WIDTH, round(im.height * ratio)), Image.LANCZOS)
    # 2. grayscale (colorize requires "L" mode per official docs)
    gray = im.convert("L")
    # 3. mild contrast lift so highlights don't muddy after the navy shadow map
    gray = ImageEnhance.Contrast(gray).enhance(1.12)
    # 4. tritone: navy shadows -> slate mid -> teal highlights
    graded = ImageOps.colorize(gray, black=NAVY, mid=MID, white=TEAL)
    # 5. saturation pull-back so it reads muted/cinematic, not neon
    graded = ImageEnhance.Color(graded).enhance(0.92)
    graded.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
    return {
        "src": os.path.basename(src_path),
        "out": os.path.basename(out_path),
        "src_kb": os.path.getsize(src_path) // 1024,
        "out_kb": os.path.getsize(out_path) // 1024,
    }


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Grading {len(SLOT_TO_SOURCE)} section images -> teal-navy WebP "
          f"(q{WEBP_QUALITY}, max-w {MAX_WIDTH}px)\n")
    for slot, source in SLOT_TO_SOURCE.items():
        src_path = os.path.join(SOURCE, source)
        if not os.path.isfile(src_path):
            raise FileNotFoundError(f"Missing source image: {src_path}")
        r = grade(src_path, os.path.join(OUT_DIR, slot))
        flag = "  OK" if r["out_kb"] <= 300 else "  OVER-300KB"
        print(f"  {r['src']:<40} -> {r['out']:<32} "
              f"{r['src_kb']:>6}KB -> {r['out_kb']:>5}KB{flag}")
    print(f"\nDone. WebP variants in {OUT_DIR}")


if __name__ == "__main__":
    main()
