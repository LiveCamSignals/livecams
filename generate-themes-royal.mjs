#!/usr/bin/env node
/**
 * LiveCams — Royal/Jewel Theme Generator
 * Produces one HTML file per color in themes-royal/<slug>.html
 * Mirrors generate-themes.mjs structure/behavior; only the palette differs.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// ── ALL COLORS (curated hex approximations) ────────────────────────────────
const COLORS = [
  { name: 'Imperial Gold', hex: '#B8860B' },
  { name: 'Royal Gold', hex: '#D4AF37' },
  { name: 'Crown Gold', hex: '#C9A227' },
  { name: 'Regal Crimson', hex: '#A91B22' },
  { name: 'Cardinal Red', hex: '#C41E3A' },
  { name: 'Burgundy Wine', hex: '#5B1A2B' },
  { name: 'Imperial Red', hex: '#B22222' },
  { name: 'Royal Scarlet', hex: '#D40000' },
  { name: 'Velvet Ruby', hex: '#7A1F3D' },
  { name: 'Crimson Velvet', hex: '#8B0000' },
  { name: 'Byzantine Purple', hex: '#702963' },
  { name: 'Tyrian Purple', hex: '#66023C' },
  { name: 'Imperial Purple', hex: '#602F6B' },
  { name: 'Royal Plum', hex: '#673147' },
  { name: 'Majestic Violet', hex: '#6A0DAD' },
  { name: 'Amethyst Royal', hex: '#9966CC' },
  { name: 'Royal Orchid', hex: '#A64CA6' },
  { name: 'Aubergine', hex: '#3B0910' },
  { name: 'Deep Garnet', hex: '#6E0D25' },
  { name: 'Noble Maroon', hex: '#5C1A1B' },
  { name: 'Sapphire Blue', hex: '#0F52BA' },
  { name: 'Royal Sapphire', hex: '#0A3D91' },
  { name: 'Midnight Sapphire', hex: '#0B1F3A' },
  { name: 'Cobalt Royal', hex: '#1E3F8B' },
  { name: 'Prussian Blue', hex: '#003153' },
  { name: 'Imperial Navy', hex: '#041E42' },
  { name: 'Royal Navy', hex: '#0B1F45' },
  { name: 'Oxford Blue', hex: '#002147' },
  { name: 'Peacock Blue', hex: '#005F6A' },
  { name: 'Azure Majesty', hex: '#1560BD' },
  { name: 'Emerald Green', hex: '#046307' },
  { name: 'Imperial Emerald', hex: '#0F5132' },
  { name: 'Jade Sovereign', hex: '#00A86B' },
  { name: 'Royal Jade', hex: '#0A6B4A' },
  { name: 'Malachite Green', hex: '#0BDA51' },
  { name: 'Verdigris', hex: '#43B3AE' },
  { name: 'Forest Emerald', hex: '#1B4D3E' },
  { name: 'Crown Teal', hex: '#0F5E5E' },
  { name: 'Antique Bronze', hex: '#665D1E' },
  { name: 'Burnished Copper', hex: '#B5651D' },
  { name: 'Gilded Bronze', hex: '#8C7853' },
  { name: 'Imperial Silver', hex: '#C0C0C0' },
  { name: 'Sterling Silver', hex: '#ACACAC' },
  { name: 'Platinum Mist', hex: '#E5E4E2' },
  { name: 'Champagne Silk', hex: '#F7E7CE' },
  { name: 'Regal Antique Ivory', hex: '#E4D9B4' },
  { name: 'Pearl White', hex: '#F0EAD6' },
  { name: 'Obsidian Black', hex: '#0B0B0B' },
  { name: 'Onyx Black', hex: '#101010' },
  { name: 'Raven Black', hex: '#141414' },
  { name: 'Alice Blue', hex: '#F0F8FF' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Air Force Blue', hex: '#5D8AA8' },
  { name: 'Arctic Blue', hex: '#7FB3D5' },
  { name: 'Aqua Blue', hex: '#00FFFF' },
  { name: 'Aquamarine Blue', hex: '#7FFFD4' },
  { name: 'Baltic Blue', hex: '#1B4F72' },
  { name: 'Berry Blue', hex: '#2A52BE' },
  { name: 'Blue Gray', hex: '#6699CC' },
  { name: 'Blue Sapphire', hex: '#126180' },
  { name: 'Bright Blue', hex: '#0096FF' },
  { name: 'Cadet Blue', hex: '#5F9EA0' },
  { name: 'Cambridge Blue', hex: '#A3C1AD' },
  { name: 'Capri Blue', hex: '#00BFFF' },
  { name: 'Carolina Blue', hex: '#4B9CD3' },
  { name: 'Cerulean', hex: '#007BA7' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Columbia Blue', hex: '#C4D8E2' },
  { name: 'Cornflower Blue', hex: '#6495ED' },
  { name: 'Cyan Blue', hex: '#00B7EB' },
  { name: 'Deep Sky Blue', hex: '#00B0E0' },
  { name: 'Denim Blue', hex: '#1E4D8C' },
  { name: 'Dodger Blue', hex: '#1E90FF' },
  { name: 'Duck Egg Blue', hex: '#C4E4E9' },
  { name: 'Electric Blue', hex: '#7DF9FF' },
  { name: 'French Blue', hex: '#0072BB' },
  { name: 'Glacier Blue', hex: '#7CA6C4' },
  { name: 'Ice Blue', hex: '#D6ECF5' },
  { name: 'Indigo Blue', hex: '#3F00FF' },
  { name: 'Lapis Blue', hex: '#26619C' },
  { name: 'Light Sky Blue', hex: '#87CEFA' },
  { name: 'Marine Blue', hex: '#013A6B' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Ocean Blue', hex: '#0077BE' },
  { name: 'Pacific Blue', hex: '#1CA9C9' },
  { name: 'Periwinkle Blue', hex: '#8F99FB' },
  { name: 'Persian Blue', hex: '#1C39BB' },
  { name: 'Powder Blue', hex: '#B0E0E6' },
  { name: 'Robin Egg Blue', hex: '#00CCCC' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Slate Blue', hex: '#6A5ACD' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Turquoise Blue', hex: '#00A3B4' },
  { name: 'African Violet', hex: '#B284BE' },
  { name: 'Amethyst', hex: '#8A4FBB' },
  { name: 'Dark Lavender', hex: '#734F96' },
  { name: 'Dark Orchid', hex: '#9932CC' },
  { name: 'Deep Lilac', hex: '#9955BB' },
  { name: 'Deep Magenta', hex: '#8B008B' },
  { name: 'Deep Plum', hex: '#4E1F4A' },
  { name: 'Eggplant', hex: '#380C34' },
  { name: 'Electric Purple', hex: '#BF00FF' },
  { name: 'Grape', hex: '#6F2DA8' },
  { name: 'Heliotrope', hex: '#DF73FF' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Iris Purple', hex: '#5D3FD3' },
  { name: 'Lavender', hex: '#B57EDC' },
  { name: 'Lavender Gray', hex: '#C4C3D0' },
  { name: 'Lavender Mist', hex: '#E6E6FA' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Majestic Purple', hex: '#6C3483' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Medium Orchid', hex: '#BA55D3' },
  { name: 'Midnight Purple', hex: '#2C0735' },
  { name: 'Imperial Mulberry', hex: '#9E4C6B' },
  { name: 'Mystic Purple', hex: '#6B2FA0' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Pansy Purple', hex: '#6C3082' },
  { name: 'Periwinkle Purple', hex: '#8E7CC3' },
  { name: 'Phlox Purple', hex: '#B33AB3' },
  { name: 'Plum', hex: '#8E4585' },
  { name: 'Purple Heart', hex: '#69359C' },
  { name: 'Purple Haze', hex: '#7847A5' },
  { name: 'Purple Majesty', hex: '#5A3D91' },
  { name: 'Purple Mountain', hex: '#9678B6' },
  { name: 'Purple Taupe', hex: '#50404D' },
  { name: 'Rebecca Purple', hex: '#663399' },
  { name: 'Regal Purple', hex: '#522888' },
  { name: 'Royal Purple', hex: '#7851A9' },
  { name: 'Royal Violet', hex: '#593A85' },
  { name: 'Thistle', hex: '#D8BFD8' },
  { name: 'Ultra Violet', hex: '#5F4B8B' },
  { name: 'Velvet Purple', hex: '#46255A' },
  { name: 'Violet', hex: '#8F00FF' },
  { name: 'Violet Blue', hex: '#324AB2' },
  { name: 'Wild Orchid', hex: '#D470A2' },
  { name: 'Wine Purple', hex: '#52192B' },
  { name: 'Wisteria', hex: '#C9A0DC' },
  { name: 'Zinnwaldite Purple', hex: '#EBC2AF' },
];

// ── COLOR MATH ────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/**
 * Given a source hex, derive a full UI palette for a dark theme.
 */
function derivePalette(hex) {
  const rgb = hexToRgb(hex);
  const { h, s } = rgbToHsl(rgb);
  const sat = clamp(s * 0.55, 3, 28);

  const srcL = rgbToHsl(rgb).l;
  const accentL = clamp(srcL < 28 ? srcL + 28 : srcL, 28, 72);
  const accent  = hslToHex(h, clamp(s, 40, 85), accentL);

  return {
    bg:           hslToHex(h, sat,           5),
    bgCard:       hslToHex(h, sat,           9),
    bgInput:      hslToHex(h, sat,          11),
    border:       hslToHex(h, clamp(sat*1.4, 4, 30), 15),
    borderHover:  hslToHex(h, clamp(sat*1.6, 5, 35), 23),
    textPrimary:  hslToHex(h, clamp(sat*0.4, 2, 10), 92),
    textSecondary:hslToHex(h, clamp(sat*0.6, 3, 14), 56),
    textMuted:    hslToHex(h, clamp(sat*0.5, 2, 12), 36),
    tagBg:        hslToHex(h, sat,          13),
    tagText:      hslToHex(h, clamp(sat*0.7, 3, 18), 66),
    liveDot:      accent,
    accent,
    hex,
  };
}

// ── SLUG ─────────────────────────────────────────────────────────────────────
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── HTML TEMPLATE ─────────────────────────────────────────────────────────────
function buildHTML(colorName, p) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LiveCams — ${colorName} Theme</title>
  <meta name="description" content="Watch live cam rooms streaming now. Thousands of live performers online — filter by name or tag." />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="LiveCams — Watch Live Now" />
  <meta property="og:description" content="Thousands of live rooms streaming right now." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="LiveCams — ${colorName}" />
  <meta name="twitter:description" content="Thousands of live rooms streaming right now." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:            ${p.bg};
      --bg-card:       ${p.bgCard};
      --bg-input:      ${p.bgInput};
      --border:        ${p.border};
      --border-hover:  ${p.borderHover};
      --text-primary:  ${p.textPrimary};
      --text-secondary:${p.textSecondary};
      --text-muted:    ${p.textMuted};
      --tag-bg:        ${p.tagBg};
      --tag-text:      ${p.tagText};
      --live-dot:      ${p.liveDot};
      --accent:        ${p.accent};
      --radius:        10px;
      --radius-sm:     6px;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      min-height: 100vh;
    }

    header {
      position: sticky; top: 0; z-index: 100;
      background: color-mix(in srgb, var(--bg) 92%, transparent);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      padding: 0 20px; height: 58px;
      display: flex; align-items: center; gap: 20px;
    }

    .logo {
      font-size: 17px; font-weight: 600; letter-spacing: -0.3px;
      color: var(--text-primary); text-decoration: none;
      white-space: nowrap; display: flex; align-items: center; gap: 7px;
    }

    .logo-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--live-dot);
      animation: pulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: .55; transform: scale(.85); }
    }

    .search-wrap { flex: 1; max-width: 460px; position: relative; }

    .search-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted); pointer-events: none; display: flex;
    }

    #search {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 40px;
      padding: 8px 14px 8px 36px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color .18s, background .18s;
    }

    #search::placeholder { color: var(--text-muted); }

    #search:focus {
      border-color: var(--border-hover);
      background: var(--bg-input);
    }

    .header-meta { margin-left: auto; color: var(--text-muted); font-size: 12.5px; white-space: nowrap; }

    main { max-width: 1400px; margin: 0 auto; padding: 28px 20px 60px; }

    .status-bar {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 22px; min-height: 24px;
    }

    .status-count { font-size: 13px; color: var(--text-muted); }
    .status-count strong { color: var(--text-secondary); }

    #grid { columns: 5 200px; column-gap: 14px; }

    @media (max-width: 900px) { #grid { columns: 3 160px; } }
    @media (max-width: 560px) { #grid { columns: 2 140px; } }

    .card {
      break-inside: avoid;
      display: block;
      margin-bottom: 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: border-color .18s, transform .18s, box-shadow .18s;
      cursor: pointer;
    }

    .card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(0,0,0,.55);
    }

    .card-thumb { position: relative; width: 100%; aspect-ratio: 4/3; background: var(--bg-input); overflow: hidden; }

    .card-thumb img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform .3s ease;
    }

    .card:hover .card-thumb img { transform: scale(1.03); }

    .card-thumb-placeholder {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      color: var(--text-muted);
    }

    .badge-live {
      position: absolute; top: 8px; left: 8px;
      background: var(--live-dot); color: #fff;
      font-size: 10px; font-weight: 600; letter-spacing: .5px;
      padding: 3px 7px; border-radius: 4px; text-transform: uppercase;
    }

    .badge-viewers {
      position: absolute; bottom: 8px; right: 8px;
      background: rgba(0,0,0,.72);
      backdrop-filter: blur(4px);
      color: var(--text-secondary);
      font-size: 11.5px; padding: 3px 8px; border-radius: 4px;
      display: flex; align-items: center; gap: 4px;
    }

    .card-body { padding: 10px 11px 11px; }

    .card-name {
      font-size: 13.5px; font-weight: 500; color: var(--text-primary);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 6px;
    }

    .card-tags { display: flex; flex-wrap: wrap; gap: 5px; }

    .tag {
      background: var(--tag-bg); color: var(--tag-text);
      font-size: 10.5px; padding: 2px 7px; border-radius: 4px;
      border: 1px solid var(--border);
      white-space: nowrap; max-width: 90px; overflow: hidden; text-overflow: ellipsis;
    }

    #state-empty, #state-error {
      display: none; flex-direction: column; align-items: center; justify-content: center;
      padding: 80px 20px; color: var(--text-muted); gap: 14px; text-align: center;
    }

    #state-empty.visible, #state-error.visible { display: flex; }

    .state-icon { font-size: 28px; opacity: .4; }

    #state-loading { display: none; columns: 5 200px; column-gap: 14px; }
    #state-loading.visible { display: block; }

    @media (max-width: 900px) { #state-loading { columns: 3 160px; } }
    @media (max-width: 560px) { #state-loading { columns: 2 140px; } }

    .skel-card {
      break-inside: avoid; margin-bottom: 14px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
    }

    .skel-thumb {
      width: 100%; aspect-ratio: 4/3;
      background: linear-gradient(100deg, var(--bg-card) 40%, var(--border) 50%, var(--bg-card) 60%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .skel-line {
      height: 10px; margin: 11px; border-radius: 4px;
      background: linear-gradient(100deg, var(--bg-card) 40%, var(--border) 50%, var(--bg-card) 60%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .skel-line.short { width: 45%; margin-top: -3px; }

    @keyframes shimmer {
      0%   { background-position: 150% 0; }
      100% { background-position: -50% 0; }
    }

    .fallback-notice {
      display: none; align-items: center; gap: 8px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 18px;
      font-size: 12.5px; color: var(--text-secondary);
    }

    .fallback-notice.visible { display: flex; }

    #pagination { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 40px; }

    .page-btn {
      background: var(--bg-input); border: 1px solid var(--border); color: var(--text-secondary);
      font-family: inherit; font-size: 13px; padding: 7px 16px; border-radius: var(--radius-sm);
      cursor: pointer; transition: border-color .15s, color .15s, background .15s;
      display: flex; align-items: center; gap: 5px;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-input);
    }

    .page-btn:disabled { opacity: .3; cursor: default; }

    .page-info { font-size: 13px; color: var(--text-muted); min-width: 90px; text-align: center; }

    footer {
      border-top: 1px solid var(--border); padding: 24px 20px; text-align: center;
      color: var(--text-muted); font-size: 12px; line-height: 1.8;
    }

    footer a { color: var(--text-muted); text-decoration: none; }
    footer a:hover { color: var(--text-secondary); }

    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }

    .icon { display: inline-flex; }
  </style>
</head>
<body>

<header>
  <a class="logo" href="#">
    <span class="logo-dot"></span>
    LiveCams
  </a>
  <div class="search-wrap">
    <label for="search" class="sr-only">Search rooms by name or tag</label>
    <span class="search-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </span>
    <input id="search" type="search" placeholder="Search by name or tag…" autocomplete="off" spellcheck="false" />
  </div>
  <div class="header-meta" id="header-meta"></div>
</header>

<main>
  <div class="status-bar">
    <div class="status-count" id="status-count"></div>
  </div>

  <div class="fallback-notice" id="fallback-notice">
    <span aria-hidden="true">⚠</span>
    <span>Live data is temporarily unavailable — showing a sample of rooms. <a href="#" id="retry-link" style="color: var(--text-primary); text-decoration: underline;">Retry live data</a></span>
  </div>

  <div id="state-loading" aria-hidden="true" aria-label="Loading rooms"></div>

  <div id="state-empty">
    <div class="state-icon">◎</div>
    <span>No rooms match your search.</span>
  </div>

  <div id="state-error">
    <div class="state-icon">⚠</div>
    <span id="error-msg">Failed to load rooms. Please try again.</span>
    <button class="page-btn" onclick="init()">Retry</button>
  </div>

  <div id="grid"></div>

  <div id="pagination">
    <button class="page-btn" id="btn-prev" disabled>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Prev
    </button>
    <span class="page-info" id="page-info"></span>
    <button class="page-btn" id="btn-next" disabled>
      Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>
</main>

<footer>
  <p>All performers are consenting adults 18+. &nbsp;·&nbsp;
    <a href="https://chaturbate.com/terms/" target="_blank" rel="noopener">Terms</a> &nbsp;·&nbsp;
    <a href="https://chaturbate.com/privacy/" target="_blank" rel="noopener">Privacy</a>
  </p>
</footer>

<script>
  const API_URL   = 'https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=T2CSW&client_ip=request_ip&limit=500';
  const REVSHARE  = (room) => \`https://chaturbate.com/in/?tour=APi5&campaign=T2CSW&track=default&room=\${room}\`;
  const PER_PAGE  = 40;

  const FALLBACK_ROOMS = [
    { username: 'sophia_rae',    num_users: 2140, tags: ['blonde', 'teen', '18'] },
    { username: 'luna_marie',    num_users: 1876, tags: ['brunette', 'lovense', 'petite'] },
    { username: 'kittykat_xo',   num_users: 3320, tags: ['redhead', 'squirt', 'anal'] },
    { username: 'valeriaxx',     num_users: 987,  tags: ['latina', 'bigass', 'dance'] },
    { username: 'emily_grace',   num_users: 1543, tags: ['couple', 'young', 'feet'] },
    { username: 'jade_moon',     num_users: 2765, tags: ['asian', 'petite', 'roleplay'] },
    { username: 'natasha_belle', num_users: 1122, tags: ['milf', 'bigboobs', 'mature'] },
    { username: 'zoe_summers',   num_users: 4012, tags: ['blonde', 'anal', 'squirt'] },
    { username: 'ariel_storm',   num_users: 856,  tags: ['teen', 'shy', 'new'] },
    { username: 'mia_flores',    num_users: 1998, tags: ['latina', 'curvy', 'lovense'] },
    { username: 'chloe_vega',    num_users: 1345, tags: ['brunette', 'tattoo', 'squirt'] },
    { username: 'harper_lee_x',  num_users: 623,  tags: ['redhead', 'freckles', 'new'] },
  ];

  let allRooms = [];
  let filtered = [];
  let currentPage = 1;
  let searchQuery = '';
  let usingFallback = false;

  const $grid      = document.getElementById('grid');
  const $search    = document.getElementById('search');
  const $loading   = document.getElementById('state-loading');
  const $empty     = document.getElementById('state-empty');
  const $error     = document.getElementById('state-error');
  const $errMsg    = document.getElementById('error-msg');
  const $count     = document.getElementById('status-count');
  const $meta      = document.getElementById('header-meta');
  const $prev      = document.getElementById('btn-prev');
  const $next      = document.getElementById('btn-next');
  const $pageInfo  = document.getElementById('page-info');
  const $notice    = document.getElementById('fallback-notice');
  const $retryLink = document.getElementById('retry-link');

  function renderSkeleton(count) {
    count = count || 15;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'skel-card';
      const thumb = document.createElement('div');
      thumb.className = 'skel-thumb';
      const line1 = document.createElement('div');
      line1.className = 'skel-line';
      const line2 = document.createElement('div');
      line2.className = 'skel-line short';
      card.appendChild(thumb);
      card.appendChild(line1);
      card.appendChild(line2);
      frag.appendChild(card);
    }
    $loading.innerHTML = '';
    $loading.appendChild(frag);
  }
  renderSkeleton();

  async function init() {
    showState('loading');
    $notice.classList.remove('visible');

    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const rooms = Array.isArray(data.results) ? data.results : [];

      if (rooms.length === 0) throw new Error('No rooms returned.');

      allRooms      = rooms;
      usingFallback = false;
      $meta.textContent = allRooms.length.toLocaleString() + ' online';
      applyFilter();
      showState('grid');
    } catch (err) {
      allRooms      = FALLBACK_ROOMS;
      usingFallback = true;
      $meta.textContent = 'sample rooms';
      $notice.classList.add('visible');
      applyFilter();
      showState('grid');
    }
  }

  $retryLink.addEventListener('click', (e) => { e.preventDefault(); init(); });

  function applyFilter() {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      filtered = allRooms.slice();
    } else {
      filtered = allRooms.filter(r => {
        if (!r || typeof r.username !== 'string') return false;
        const inName = r.username.toLowerCase().includes(q);
        const inTags = Array.isArray(r.tags) && r.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q));
        const inSubj = typeof r.subject === 'string' && r.subject.toLowerCase().includes(q);
        return inName || inTags || inSubj;
      });
    }

    currentPage = 1;
    render();
  }

  function render() {
    $grid.innerHTML = '';

    if (filtered.length === 0) {
      showState('empty');
      updatePagination(0);
      return;
    }

    showState('grid');

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);

    const fromN = start + 1;
    const toN   = Math.min(start + PER_PAGE, filtered.length);
    $count.innerHTML = filtered.length < allRooms.length
      ? '<strong>' + filtered.length.toLocaleString() + '</strong> results — showing ' + fromN + '–' + toN
      : '<strong>' + filtered.length.toLocaleString() + '</strong> rooms live — showing ' + fromN + '–' + toN;

    const frag = document.createDocumentFragment();
    slice.forEach(room => { frag.appendChild(buildCard(room)); });
    $grid.appendChild(frag);

    updatePagination(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildCard(room) {
    const username = typeof room.username === 'string' ? room.username : String(room.username || '');
    const viewers  = Math.max(0, parseInt(room.num_users, 10) || 0).toLocaleString();
    const tags     = Array.isArray(room.tags) ? room.tags.slice(0, 4).map(t => String(t || '').trim()).filter(Boolean) : [];
    const imgSrc   = typeof room.image_url_360x270 === 'string' ? room.image_url_360x270
                   : typeof room.image_url         === 'string' ? room.image_url : '';

    const a = document.createElement('a');
    a.className = 'card';
    a.href      = REVSHARE(encodeURIComponent(username));
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';
    a.setAttribute('aria-label', username);

    const thumb = document.createElement('div');
    thumb.className = 'card-thumb';

    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = username;
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'card-thumb-placeholder';
      ph.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".3"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
      thumb.appendChild(ph);
    }

    const badgeLive = document.createElement('span');
    badgeLive.className = 'badge-live';
    badgeLive.textContent = 'Live';
    thumb.appendChild(badgeLive);

    const badgeViewers = document.createElement('span');
    badgeViewers.className = 'badge-viewers';
    badgeViewers.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    badgeViewers.appendChild(document.createTextNode(' ' + viewers));
    thumb.appendChild(badgeViewers);

    a.appendChild(thumb);

    const body = document.createElement('div');
    body.className = 'card-body';

    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = username;
    body.appendChild(nameEl);

    if (tags.length) {
      const tagsEl = document.createElement('div');
      tagsEl.className = 'card-tags';
      tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagsEl.appendChild(span);
      });
      body.appendChild(tagsEl);
    }

    a.appendChild(body);
    return a;
  }

  function updatePagination(totalPages) {
    totalPages = totalPages || 0;
    $prev.disabled = currentPage <= 1;
    $next.disabled = currentPage >= totalPages;
    $pageInfo.textContent = totalPages > 0 ? 'Page ' + currentPage + ' / ' + totalPages : '';
    document.getElementById('pagination').style.display = totalPages > 1 ? 'flex' : 'none';
  }

  $prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
  $next.addEventListener('click', () => {
    const tp = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage < tp) { currentPage++; render(); }
  });

  let searchTimer;
  $search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { searchQuery = $search.value; applyFilter(); }, 260);
  });

  function showState(state) {
    $loading.classList.toggle('visible', state === 'loading');
    $empty.classList.toggle('visible',   state === 'empty');
    $error.classList.toggle('visible',   state === 'error');
    $grid.style.display = state === 'grid' ? '' : 'none';
  }

  init();
<\/script>
</body>
</html>`;
}

// ── RUN ───────────────────────────────────────────────────────────────────────
const outDir = 'themes-royal';
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const color of COLORS) {
  const palette = derivePalette(color.hex);
  const html    = buildHTML(color.name, palette);
  const file    = join(outDir, `${slugify(color.name)}.html`);
  writeFileSync(file, html, 'utf8');
  count++;
  process.stdout.write(`  ✓  ${file}  (accent: ${palette.accent})\n`);
}

console.log(`\nGenerated ${count} themes → ${outDir}/`);
