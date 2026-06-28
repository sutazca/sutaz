#!/usr/bin/env python3
"""
sutaz.ca — duotone grade pass (Phase 3 §4.4 imagery treatment).

Grades every JPG in public/sections/ to the teal-navy palette so each reads
art-directed, not raw stock. This is the Vercel/Linear-tier technique the
DESIGN-ELEVATION.md §4.4 doc cites ("every image is color-graded to the
teal-navy palette before placement").

VERIFIED TECHNIQUE (not assumed — checked against official Pillow docs,
readthedocs.io/en/stable/reference/ImageOps.html, this session 2026-06-29):
  ImageOps.colorize() requires a GRAYSCALE source image. It maps luminance to
  a 2-color (black→white) or 3-color (black→mid→white) wedge. So the pipeline
  for a COLOR photo is:
      1. convert to grayscale ("L")
      2. optionally lift contrast so highlights pop after grading
      3. colorize(gray, black=NAVY, mid=<desaturated>, white=TEAL)

Palette (from globals.css @theme):
  shadows → navy   #0a0e1a  (10, 14, 26)
  midtones → desaturated slate-blue, slightly cool
  highlights → teal  #14b8a6  (20, 184, 166)

Idempotent + safe: writes -graded.jpg variants. Re-running overwrites cleanly.
Originals in pictures/ are never touched (the source of truth).
"""
import sys, os
from PIL import Image, ImageOps, ImageEnhance

SECTIONS = r"C:\Users\root\Desktop\sutaz.ca\public\sections"

# Brand palette (mirrors analyze-pictures.py + globals.css @theme)
NAVY = (10, 14, 26)        # #0a0e1a — shadows
TEAL = (20, 184, 166)      # #14b8a6 — highlights
MID = (48, 60, 90)         # desaturated slate-blue midtone (cool, on-brand)


def grade(path: str) -> dict:
    out = path
    if not out.endswith("-graded.jpg"):
        out = out[:-4] + "-graded.jpg" if out.lower().endswith(".jpg") else out + "-graded"
    im = Image.open(path).convert("RGB")
    # 1. grayscale (colorize requires "L" mode per official docs)
    gray = im.convert("L")
    # 2. mild contrast lift so highlights don't muddy after the navy shadow map
    gray = ImageEnhance.Contrast(gray).enhance(1.12)
    # 3. duotone/tritone: navy shadows → slate mid → teal highlights
    graded = ImageOps.colorize(gray, black=NAVY, mid=MID, white=TEAL)
    # 4. slight saturation pull-back so it reads muted/cinematic, not neon
    graded = ImageEnhance.Color(graded).enhance(0.92)
    graded.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    in_sz = os.path.getsize(path) // 1024
    out_sz = os.path.getsize(out) // 1024
    return {"in": os.path.basename(path), "out": os.path.basename(out),
            "in_kb": in_sz, "out_kb": out_sz}


def main():
    jpgs = sorted(f for f in os.listdir(SECTIONS)
                  if f.lower().endswith(".jpg") and "-graded" not in f)
    if not jpgs:
        print("No source JPGs to grade in", SECTIONS)
        return
    print(f"Grading {len(jpgs)} images → teal-navy duotone (navy#0a0e1a → slate → teal#14b8a6)\n")
    for f in jpgs:
        r = grade(os.path.join(SECTIONS, f))
        delta = r["out_kb"] - r["in_kb"]
        sign = "+" if delta >= 0 else ""
        print(f"  {r['in']:<28} → {r['out']:<34} {r['in_kb']:>6}KB → {r['out_kb']:>6}KB ({sign}{delta}KB)")
    print(f"\nDone. Graded variants in {SECTIONS}/*-graded.jpg")


if __name__ == "__main__":
    main()
