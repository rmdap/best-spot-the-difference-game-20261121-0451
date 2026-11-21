// main.js — entry point. Wires the canvases, the HUD, the input and the game
// loop together, and stages a screenshot scene when the URL asks for one
// (?shot=cover|start|round2|win). The timer runs on requestAnimationFrame
// and pauses whenever the game is not in play or a shot is staged.
import { createGame, SCREEN_TITLE, SCREEN_ROUND, SCREEN_OVER, SCREEN_WIN } from './game.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';
import { PANEL_W, PANEL_H } from './scenes.js';

const leftCanvas = document.getElementById('left');
const rightCanvas = document.getElementById('right');
const overlayEl = document.getElementById('overlay');

const hud = {
  timer: document.getElementById('timer'),
  score: document.getElementById('score'),
  found: document.getElementById('found'),
  round: document.getElementById('round'),
  bar: document.getElementById('bar'),
  hint: document.getElementById('hint'),
  message: document.getElementById('message'),
};

const overlay = {
  el: overlayEl,
  title: document.getElementById('ov-title'),
  sub: document.getElementById('ov-sub'),
  lines: document.getElementById('ov-lines'),
  cta: document.getElementById('ov-cta'),
};

const audio = createAudio();
const renderer = createRenderer(leftCanvas, rightCanvas, hud, overlay);
let game = null;

function onChange(kind) {
  if (!game) return;
  if (kind === 'found') audio.found();
  if (kind === 'miss') audio.wrong();
  if (kind === 'hint') audio.hint();
  if (kind === 'screen' && game.state.screen === SCREEN_WIN) audio.win();
  if (kind === 'screen' && game.state.screen === SCREEN_OVER) audio.lose();
  renderer.render(game);
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

function handleCanvasClick(canvas) {
  return (event) => {
    audio.unlock();
    if (!game) return;
    if (game.state.screen !== 'play') return;
    const p = canvasPoint(canvas, event);
    game.clickAt(p.x, p.y);
    renderer.render(game);
  };
}

function handleOverlayClick() {
  audio.unlock();
  if (!game) return;
  const s = game.state.screen;
  if (s === SCREEN_TITLE) { audio.click(); game.startGame(); }
  else if (s === SCREEN_ROUND) { audio.click(); game.nextRound(); }
  else if (s === SCREEN_OVER) { audio.click(); game.startRound(game.state.round); }
  else if (s === SCREEN_WIN) { audio.click(); game.toTitle(); }
  renderer.render(game);
}

function handleKey(event) {
  if (!game) return;
  if (event.key === 'h' || event.key === 'H') {
    if (game.useHint()) { audio.hint(); renderer.render(game); }
  } else if (event.key === 'r' || event.key === 'R') {
    if (game.state.screen === 'play' || game.state.screen === SCREEN_OVER) {
      game.startRound(game.state.round);
      renderer.render(game);
    }
  } else if (event.key === 'm' || event.key === 'M') {
    const muted = audio.toggleMute();
    document.getElementById('mute').textContent = muted ? 'Unmute (M)' : 'Mute (M)';
  }
}

game = createGame(onChange);
leftCanvas.addEventListener('click', handleCanvasClick(leftCanvas));
rightCanvas.addEventListener('click', handleCanvasClick(rightCanvas));
overlayEl.addEventListener('click', handleOverlayClick);
document.getElementById('hint').addEventListener('click', () => {
  audio.unlock();
  if (game.useHint()) renderer.render(game);
});
document.getElementById('restart').addEventListener('click', () => {
  audio.unlock();
  if (game.state.screen === 'play' || game.state.screen === SCREEN_OVER) {
    game.startRound(game.state.round);
    renderer.render(game);
  }
});
document.getElementById('mute').addEventListener('click', (event) => {
  audio.unlock();
  const muted = audio.toggleMute();
  event.currentTarget.textContent = muted ? 'Unmute (M)' : 'Mute (M)';
});
window.addEventListener('keydown', handleKey);

// A screenshot scene (?shot=...) stages a frozen frame; otherwise the game
// opens on its title screen over the first scene.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
game.startRound(0);
game.state.screen = SCREEN_TITLE;
if (shot) stageShot(shot, game, audio);
renderer.render(game);

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (game.state.screen === 'play' && !game.state.paused) {
    if (game.tick(dt)) audio.lose();
  }
  renderer.render(game);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
