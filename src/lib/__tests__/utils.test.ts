import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCAD, formatNumber, cn } from "../utils.ts";

test("formatCAD renders CAD currency with no decimals", () => {
  assert.equal(formatCAD(1234.5), "$1,235");     // rounds, no decimals
  assert.equal(formatCAD(0), "$0");
  assert.equal(formatCAD(1000000), "$1,000,000"); // thousands sep
});

test("formatNumber renders with en-CA grouping, rounded", () => {
  assert.equal(formatNumber(1234.5), "1,235");
  assert.equal(formatNumber(0), "0");
  assert.equal(formatNumber(-99.4), "-99");
});

test("cn merges tailwind classes (later wins)", () => {
  assert.equal(cn("px-4", "px-6"), "px-6");
  assert.equal(cn("text-sm"), "text-sm");
});
