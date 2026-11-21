// render.js — draws the two picture panels, the markers on the differences
// found, the hint pulse and the miss flash. The title and end screens are a
// DOM overlay spanning both panels, so the text sits centred over the game.
import { PANEL_W, PANEL_H } from './scenes.js';

function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = PANEL_W * dpr;
  canvas.height = PANEL_H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function drawMarker(ctx, x, y, r, ok) {
  ctx.strokeStyle = ok ? '#2ecc71' : '#e74c3c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = ok ? 'rgba(46,204,113,0.35)' : 'rgba(231,76,60,0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPanel(ctx, scene, variant, game) {
  scene.draw(ctx, variant);
  const now = performance.now();
  for (const i of game.state.found) {
    const d = scene.diffs[i];
    drawMarker(ctx, d.x, d.y, d.r, true);
  }
  if (game.state.hintAt && now < game.state.hintAt.until) {
    const pulse = 1 + 0.15 * Math.sin(now / 120);
    const h = game.state.hintAt;
    ctx.strokeStyle = '#f2c14e';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(h.x, h.y, (h.r + 8) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (game.state.flash && now < game.state.flash.until) {
    const f = game.state.flash;
    drawMarker(ctx, f.x, f.y, f.r, f.ok);
    if (!f.ok) {
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(f.x - 10, f.y - 10);
      ctx.lineTo(f.x + 10, f.y + 10);
      ctx.moveTo(f.x + 10, f.y - 10);
      ctx.lineTo(f.x - 10, f.y + 10);
      ctx.stroke();
    }
  }
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const OVERLAY_TEXT = {
  title: {
    title: 'DOUBLE TAKE',
    sub: 'Spot the Difference',
    lines: [
      'Two pictures. Five to seven hidden changes in every scene.',
      'Click a difference on either picture to mark it.',
      '3 rounds • hints cost points • wrong clicks cost time',
    ],
    cta: 'Click anywhere to play',
  },
  round: {
    title: 'Round Clear!',
    sub: '',
    lines: [],
    cta: 'Click anywhere for the next round',
  },
  over: {
    title: "Time's Up!",
    sub: '',
    lines: [],
    cta: 'Click anywhere to try this round again',
  },
  win: {
    title: 'You Win!',
    sub: '',
    lines: [],
    cta: 'Click anywhere to play again',
  },
};

export function createRenderer(leftCanvas, rightCanvas, hud, overlay) {
  const leftCtx = setupCanvas(leftCanvas);
  const rightCtx = setupCanvas(rightCanvas);

  function render(game) {
    const scene = game.scene();
    drawPanel(leftCtx, scene, 0, game);
    drawPanel(rightCtx, scene, 1, game);

    const st = game.state;
    hud.timer.textContent = fmtTime(st.timeLeft);
    hud.timer.classList.toggle('low', st.timeLeft <= 15 && st.screen === 'play');
    hud.score.textContent = String(st.score);
    hud.found.textContent = `${game.foundCount()} of ${scene.diffs.length} found • ${game.remaining()} left`;
    hud.round.textContent = `Round ${st.round + 1} of 3 — ${scene.name}`;
    const total = scene.diffs.length;
    hud.bar.style.width = `${total === 0 ? 0 : (game.foundCount() / total) * 100}%`;
    hud.hint.textContent = `Hint (${st.hintsLeft})`;
    hud.hint.disabled = st.hintsLeft <= 0 || st.screen !== 'play';
    hud.message.textContent = st.message;

    // Overlay screens (title / round clear / time up / win).
    if (st.screen === 'play') {
      overlay.el.classList.add('hidden');
      return;
    }
    const spec = OVERLAY_TEXT[st.screen] || OVERLAY_TEXT.title;
    overlay.title.textContent = spec.title;
    overlay.sub.textContent = spec.sub;
    overlay.sub.style.display = spec.sub ? '' : 'none';
    let lines = spec.lines.slice();
    if (st.screen === 'round') lines = [`Score: ${st.score}`];
    if (st.screen === 'over') {
      lines = [
        `You found ${game.foundCount()} of ${scene.diffs.length} differences`,
        `Score: ${st.score}`,
      ];
    }
    if (st.screen === 'win') {
      lines = [
        `All 18 differences found — Score: ${st.score}`,
        `Best: ${st.best}`,
      ];
    }
    overlay.lines.innerHTML = lines.map((l) => `<div>${l}</div>`).join('');
    overlay.cta.textContent = spec.cta;
    overlay.el.classList.remove('hidden');
  }

  return { render };
}
