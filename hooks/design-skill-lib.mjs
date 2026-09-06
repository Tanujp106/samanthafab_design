#!/usr/bin/env node
/** Shared helpers for Samantha Fab design-skill hooks. */

import { stdin } from "node:process";

export const STATE_DIR = "hooks/state";

export const DESIGN_CONTEXT = [
  "Using samantha-fab-design (mandatory for design/UI work in this repo).",
  "Before inventing treatments, read and follow:",
  "- skills/samantha-fab-design/SKILL.md",
  "- skills/samantha-fab-design/nits.md",
  "Announce: Using samantha-fab-design.",
  "On lasting design corrections, update those skill files in the same turn (Upkeep).",
].join("\n");

export function isDesignPrompt(text) {
  const t = String(text || "").toLowerCase();
  if (!t.trim()) return false;
  return (
    /page feedback/.test(t) ||
    /\/design\b/.test(t) ||
    /\bdesign\b/.test(t) ||
    /\bui\b/.test(t) ||
    /\btypography\b/.test(t) ||
    /\bspacing\b/.test(t) ||
    /\bhero\b/.test(t) ||
    /\bbento\b/.test(t) ||
    /\bbanner\b/.test(t) ||
    /\bproduct (rail|card|carousel)\b/.test(t) ||
    /\blayout\b/.test(t) ||
    /\bpixel\b/.test(t) ||
    /\bnit\b/.test(t)
  );
}

export function isDesignPath(path) {
  const p = String(path || "").replace(/\\/g, "/");
  return (
    /playground\/styles\/design\.css$/.test(p) ||
    /playground\/pages\/blank\.js$/.test(p) ||
    /playground\/components\/(render|media)\.js$/.test(p) ||
    /playground\/app\.js$/.test(p) ||
    /playground\/design\//.test(p) ||
    /skills\/samantha-fab-design\//.test(p)
  );
}

export function isDesignSourcePath(path) {
  const p = String(path || "").replace(/\\/g, "/");
  return (
    /playground\/styles\/design\.css$/.test(p) ||
    /playground\/pages\/blank\.js$/.test(p) ||
    /playground\/components\/(render|media)\.js$/.test(p) ||
    /playground\/app\.js$/.test(p) ||
    /playground\/styles\/(tokens|layout)\.css$/.test(p)
  );
}

export function isSkillPath(path) {
  return /skills\/samantha-fab-design\//.test(String(path || "").replace(/\\/g, "/"));
}

export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
