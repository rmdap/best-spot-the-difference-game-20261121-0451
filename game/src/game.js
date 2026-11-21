// game.js — the rules of Double Take: rounds, timer, score, hints, and the
// click handling that decides whether a tap found a difference or missed.
// The pictures themselves live in scenes.js; this file only knows the rules.
import { SCENES, PANEL_W, PANEL_H } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_ROUND = 'round';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

const WRONG_POINTS = 10;
const WRONG_SECONDS = 5;
const FIND_POINTS = 100;
const HINT_COST = 25;
const HINTS_PER_ROUND = 3;

export function createGame(onChange) {
  const state = {
    screen: SCREEN_TITLE,
    round: 0,
    score: 0,
    best: 0,
    found: [],
    timeLeft: 0,
    hintsLeft: HINTS_PER_ROUND,
    paused: false,
    message: '',
    flash: null,
    hintAt: null,
    lastTick: 0,
  };

  try {
    state.best = Number(localStorage.getItem('doubletake-best') || 0) || 0;
  } catch (e) { /* storage unavailable: best stays 0 */ }

  function scene() { return SCENES[state.round]; }
  function foundCount() { return state.found.length; }
  function remaining() { return scene().diffs.length - state.found.length; }

  function setMessage(text) {
    state.message = text;
    onChange('message');
  }

  function startRound(round) {
    state.round = round;
    state.found = [];
    state.timeLeft = scene().timeLimit;
    state.hintsLeft = HINTS_PER_ROUND;
    state.screen = SCREEN_PLAY;
    state.flash = null;
    state.hintAt = null;
    setMessage(`Round ${round + 1}: ${scene().name} — find ${scene().diffs.length} differences!`);
    onChange('round');
  }

  function startGame() {
    state.score = 0;
    startRound(0);
  }

  function endRound() {
    const bonus = Math.round(state.timeLeft) * 5;
    state.score += bonus;
    if (state.round + 1 >= SCENES.length) {
      state.screen = SCREEN_WIN;
      if (state.score > state.best) {
        state.best = state.score;
        try { localStorage.setItem('doubletake-best', String(state.best)); } catch (e) { /* ignore */ }
      }
      setMessage(`You found them all! Time bonus +${bonus}.`);
    } else {
      state.screen = SCREEN_ROUND;
      setMessage(`Round clear! Time bonus +${bonus}. Get ready for round ${state.round + 2}…`);
    }
    onChange('screen');
  }

  function gameOver() {
    state.screen = SCREEN_OVER;
    setMessage(`Time ran out with ${remaining()} difference${remaining() === 1 ? '' : 's'} still hidden.`);
    onChange('screen');
  }

  /** A click at panel coordinates (x, y) on either panel. */
  function clickAt(x, y) {
    if (state.screen !== SCREEN_PLAY || state.paused) return;
    if (x < 0 || y < 0 || x > PANEL_W || y > PANEL_H) return;
    const diffs = scene().diffs;
    for (let i = 0; i < diffs.length; i += 1) {
      if (state.found.includes(i)) continue;
      const d = diffs[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= (d.r + 10) * (d.r + 10)) {
        state.found.push(i);
        state.score += FIND_POINTS;
        state.flash = { x: d.x, y: d.y, r: d.r, ok: true, until: performance.now() + 450 };
        setMessage(foundCount() === diffs.length ? 'Last one! ' : `Found it — ${d.label}! ${remaining()} left.`);
        onChange('found');
        if (foundCount() === diffs.length) endRound();
        return 'found';
      }
    }
    state.score = Math.max(0, state.score - WRONG_POINTS);
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_SECONDS);
    state.flash = { x, y, r: 14, ok: false, until: performance.now() + 450 };
    setMessage(`Not there — −${WRONG_POINTS} pts, −${WRONG_SECONDS}s. Look closer!`);
    onChange('miss');
    return 'miss';
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.paused) return false;
    if (state.hintsLeft <= 0) { setMessage('No hints left this round!'); return false; }
    const unfound = scene().diffs.map((d, i) => i).filter((i) => !state.found.includes(i));
    if (unfound.length === 0) return false;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    const d = scene().diffs[pick];
    state.hintAt = { x: d.x, y: d.y, r: d.r, until: performance.now() + 2000 };
    setMessage(`Hint: something hides near here… (−${HINT_COST} pts)`);
    onChange('hint');
    return true;
  }

  /** Advance the countdown by dt seconds; returns true when time runs out. */
  function tick(dt) {
    if (state.screen !== SCREEN_PLAY || state.paused) return false;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      gameOver();
      return true;
    }
    onChange('tick');
    return false;
  }

  function nextRound() {
    if (state.screen === SCREEN_ROUND) startRound(state.round + 1);
  }

  function toTitle() { state.screen = SCREEN_TITLE; onChange('screen'); }

  return {
    state, scene, foundCount, remaining, startGame, startRound, clickAt,
    useHint, tick, nextRound, toTitle, setMessage,
  };
}
