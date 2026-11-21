# Double Take — Best Spot the Difference Game

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rmdap/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rmdap/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Double Take** is a spot-the-difference game for the make.fun bounty
[best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
Two near-identical hand-drawn pictures sit side by side; find every hidden
difference before the timer runs out.

## How to play

- Click a difference on **either** picture to mark it — a green circle appears
  on both panels. Correct find: **+100 points**.
- Wrong click: **−10 points and −5 seconds**, with a red flash.
- **Hint (H)**: pulses one hidden difference for 2 seconds. Costs 25 points,
  3 per round.
- **R** restarts the round. **M** mutes the sounds.

## The rounds

1. **Sunny Park** — 5 differences, 90 seconds.
2. **Cozy Kitchen** — 6 differences, 75 seconds.
3. **Space Station** — 7 differences, 60 seconds.

Finish a round to bank a time bonus (5 points per second left). Find all 18
differences to win; your best score is saved on your machine.

## Play it

Serve `game/` with any static server and open `index.html` in desktop Chrome:

```sh
cd game && python3 -m http.server 8080
```

No network, no build step, no external assets — every picture is drawn in
code, and the sounds are generated with WebAudio.

## Hand-in

`main.ts` (Node 22) copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the kit's vendored `vendor/makefun-game.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the game, staged with
`?shot=cover|start|round2|win`.
