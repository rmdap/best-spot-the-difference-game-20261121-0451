// shots.js — deterministic screenshot scenes behind ?shot=cover|start|round2|win.
// Each one plays the real rules forward from a fresh game and freezes the
// frame (the timer is paused), so the same URL always gives the same frame:
// the cover shows two found differences marked and three still hidden, with
// the counter reading "2 of 5 found • 3 left".
import { SCREEN_PLAY } from './game.js';

/** Mark the first `count` differences of the current round as found. */
function markFound(game, count) {
  const diffs = game.scene().diffs;
  for (let i = 0; i < Math.min(count, diffs.length); i += 1) {
    game.state.found.push(i);
    game.state.score += 100;
  }
}

/**
 * Set `game` to the named scene and return the screen to show.
 * cover: round 1 mid-play, 2 of 5 found. start: title over round 1.
 * round2: round 2 mid-play, 3 of 6 found. win: victory over round 3, all found.
 */
export function stageShot(name, game, audio) {
  game.state.paused = true;
  if (name === 'start') {
    game.startRound(0);
    game.state.screen = 'title';
    game.state.timeLeft = game.scene().timeLimit;
    game.state.score = 0;
    return;
  }
  if (name === 'round2') {
    game.startRound(1);
    game.state.screen = SCREEN_PLAY;
    game.state.score = 350;
    game.state.timeLeft = 48;
    markFound(game, 3);
    game.setMessage('Found it — cat stripes! 3 left.');
    return;
  }
  if (name === 'win') {
    game.startRound(2);
    game.state.screen = 'win';
    game.state.score = 2140;
    game.state.timeLeft = 12;
    markFound(game, game.scene().diffs.length);
    game.state.best = 2840;
    game.setMessage('You found them all! Time bonus +60.');
    return;
  }
  // Default: cover — round 1 mid-play, 2 of 5 found.
  game.startRound(0);
  game.state.screen = SCREEN_PLAY;
  game.state.score = 200;
  game.state.timeLeft = 72;
  markFound(game, 2);
  game.setMessage('Found it — kite! 3 left.');
}
