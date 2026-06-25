# Arithmetic Tester

A Zetamac-style mental-arithmetic trainer. Single-page, offline-capable, built
to run as a home-screen PWA on iPhone. Timed run (default 120s); problems
auto-advance the instant your typed answer is correct, then a results screen.

No build step, no frameworks, no external/CDN libraries — deliberately, so it
keeps working fully offline.

## Files

- **index.html** — the entire app: inline CSS + vanilla JS, self-contained.
- **sw.js** — service worker, stale-while-revalidate caching. Registers only
  over HTTPS and must sit in the same folder as `index.html`.

## How it works

- **Answer entry** uses the native numeric keyboard (`inputmode="numeric"`).
- **Presets** — 3 modes live in the `PRESETS` array at the top of the script in
  `index.html`: (1) Zetamac defaults +−×÷, (2) Mult/Div 12–19 × 12–100,
  (3) 3-digit add/sub. Pick on the home screen; Start runs the selected one.
- **Settings cog** edits the selected preset in memory for the session only —
  changes reset on reload. Permanent changes mean editing the `PRESETS` array.
- **Math invariants** — subtraction is always non-negative (rendered as
  `(a+b) − a = b`); division is always integer (`a*b ÷ a = b`).
- **Stop button** (top-right during a run) ends early; the per-minute rate is
  computed from actual elapsed time, not the full duration.
- **Results screen** — a hand-rolled SVG timeseries (seconds per question
  across the run, with a dashed average line) plus a "slowest 5 questions" list,
  those 5 highlighted as red dots on the chart. Hand-built specifically to avoid
  a charting dependency.
- **Per-run data** is in memory only — it resets on "Go again" and is not
  persisted across sessions.

## Deploy

Static hosting over HTTPS (GitHub Pages / Netlify). Keep both files in the same
directory. After changes, bump `CACHE` in `sw.js` (`trainer-v2` → `v3` …) and
reload once online so the new service worker activates — otherwise cached
versions keep serving.
