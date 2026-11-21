# AGENT.md — how Double Take was built

Built in a fresh agent session started after the competition opened
(2026-11-21T04:51:00Z), for the make.fun bounty
best-spot-the-difference-game-20261121-0451.

## The game

`game/` is plain static files, no build step, no network, no external assets:

- `game/index.html` — layout: header bar, two canvases side by side, HUD
  (timer, score, found counter, progress bar, hint/restart/mute buttons),
  and a DOM overlay for the title / round-clear / time-up / win screens.
- `game/src/scenes.js` — the three hand-drawn scenes (Sunny Park, Cozy
  Kitchen, Space Station) and their 5 + 6 + 7 = 18 differences. All art is
  procedural canvas drawing; each scene draws variant 0 (left, original)
  and variant 1 (right, with the differences).
- `game/src/game.js` — the rules: rounds, countdown, score, hints,
  click handling, win/lose states.
- `game/src/render.js` — draws both panels, the green markers on found
  differences, the hint pulse, the miss flash, and the DOM overlay.
- `game/src/audio.js` — WebAudio sound effects, generated, no audio files.
- `game/src/shots.js` — deterministic screenshot staging behind
  `?shot=cover|start|round2|win` (the timer is frozen for the frame).
- `game/src/main.js` — entry point: wires the canvases, HUD, input and the
  game loop together.

## Hand-in

`main.ts` (Node 22, written fresh for this entry) copies `game/` and
`screenshots/` to `$MAKEFUN_OUTPUT_DIR` and writes `dossier.json` with
`buildDossier` from the kit's `vendor/makefun-game.ts` (copied unchanged).

Screenshots are real headless-Chrome renders of the game's own code at
1280×800, taken with Playwright: `1-cover.jpg` (round 1 mid-play, 2 of 5
found), `2-start.jpg` (title), `3-round2.jpg` (round 2 mid-play, 3 of 6
found), `4-win.jpg` (victory, all 7 of round 3 found).

## Verification

- Served `game/` locally; played through in a headless browser: clicks on
  differences mark them on both panels, wrong clicks cost points and time,
  the timer runs, the round-clear and win screens are reachable.
- Ran `main.ts` twice with different `MAKEFUN_OUTPUT_DIR` values; both
  outputs contain `game/`, `screenshots/` and `dossier.json`.
