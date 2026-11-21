// scenes.js — the three hand-drawn scenes of Double Take and the differences
// hidden in each one. Every scene is drawn twice: variant 0 is the left panel
// (the original), variant 1 is the right panel (with the differences applied).
// All art is procedural canvas drawing — no image files, no network.

export const PANEL_W = 480;
export const PANEL_H = 360;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function cloud(ctx, x, y, s) {
  circle(ctx, x, y, 18 * s, '#ffffff');
  circle(ctx, x + 16 * s, y - 8 * s, 14 * s, '#ffffff');
  circle(ctx, x + 32 * s, y, 16 * s, '#ffffff');
  circle(ctx, x + 16 * s, y + 6 * s, 15 * s, '#ffffff');
}

// ---------------------------------------------------------------------------
// Scene 1 — Sunny Park. 5 differences, 90 seconds.
// ---------------------------------------------------------------------------
function drawPark(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d8f1ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Sun, top right, with rays.
  circle(ctx, 405, 58, 30, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 405 + Math.cos(a) * 36, 58 + Math.sin(a) * 36, 405 + Math.cos(a) * 48, 58 + Math.sin(a) * 48, '#ffd93b', 4);
  }

  // Clouds.
  cloud(ctx, 80, 52, 1);
  cloud(ctx, 245, 38, 0.8);
  // Difference 4: the right panel has a third cloud.
  if (variant === 1) cloud(ctx, 345, 82, 0.7);

  // Rolling green hills.
  ctx.fillStyle = '#69b455';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.quadraticCurveTo(140, 210, 280, 248);
  ctx.quadraticCurveTo(380, 275, 480, 240);
  ctx.lineTo(480, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#57a047';
  ctx.beginPath();
  ctx.moveTo(0, 290);
  ctx.quadraticCurveTo(160, 260, 320, 292);
  ctx.quadraticCurveTo(420, 312, 480, 288);
  ctx.lineTo(480, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();

  // Kite in the sky. Difference 1: the kite is missing on the right.
  if (variant === 0) {
    poly(ctx, [[180, 78], [200, 96], [180, 116], [160, 96]], '#e14b4b');
    line(ctx, 180, 116, 172, 160, '#5b4636', 1.5);
    line(ctx, 172, 160, 168, 196, '#5b4636', 1.5);
    poly(ctx, [[168, 128], [176, 134], [170, 140]], '#f2c14e');
  }

  // Tree on the left.
  rect(ctx, 62, 170, 16, 80, '#7a4a21');
  circle(ctx, 70, 150, 42, '#3f9e4d');
  circle(ctx, 42, 172, 28, '#4cb45c');
  circle(ctx, 100, 172, 28, '#4cb45c');
  circle(ctx, 70, 128, 30, '#57b866');
  // Apples on the tree. Difference 5: one apple is missing on the right.
  circle(ctx, 52, 158, 6, '#e14b4b');
  circle(ctx, 88, 140, 6, '#e14b4b');
  if (variant === 0) circle(ctx, 96, 168, 6, '#e14b4b');

  // Bench.
  rect(ctx, 285, 245, 90, 8, '#8a5a2b');
  rect(ctx, 285, 262, 90, 8, '#8a5a2b');
  rect(ctx, 292, 270, 8, 30, '#6b4423');
  rect(ctx, 360, 270, 8, 30, '#6b4423');
  rect(ctx, 285, 232, 8, 14, '#6b4423');
  rect(ctx, 367, 232, 8, 14, '#6b4423');

  // Flower bed: three flowers. Difference 3: the middle flower is red on the
  // left and purple on the right.
  const flowers = [
    { x: 150, petal: '#e14b4b' },
    { x: 205, petal: variant === 0 ? '#e14b4b' : '#8e44ad' },
    { x: 258, petal: '#f2c14e' },
  ];
  for (const f of flowers) {
    line(ctx, f.x, 312, f.x, 336, '#2e7d32', 3);
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2;
      circle(ctx, f.x + Math.cos(a) * 8, 306 + Math.sin(a) * 8, 6, f.petal);
    }
    circle(ctx, f.x, 306, 6, '#fff3b0');
  }

  // Dog on the right. Difference 2: the spot on its body is missing on the right.
  ellipse(ctx, 398, 300, 30, 16, '#b07a45');
  circle(ctx, 424, 288, 13, '#b07a45');
  poly(ctx, [[418, 278], [424, 266], [430, 278]], '#b07a45');
  circle(ctx, 428, 286, 2, '#222222');
  line(ctx, 370, 296, 356, 282, '#b07a45', 5);
  rect(ctx, 378, 312, 6, 12, '#8a5a2b');
  rect(ctx, 412, 312, 6, 12, '#8a5a2b');
  if (variant === 0) ellipse(ctx, 396, 296, 9, 6, '#6b4423');

  // Winding path.
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.moveTo(215, 360);
  ctx.quadraticCurveTo(235, 320, 225, 290);
  ctx.quadraticCurveTo(220, 275, 240, 268);
  ctx.quadraticCurveTo(262, 275, 258, 296);
  ctx.quadraticCurveTo(252, 330, 268, 360);
  ctx.closePath();
  ctx.fill();
}

const PARK_DIFFS = [
  { x: 180, y: 96, r: 22, label: 'kite' },
  { x: 396, y: 296, r: 18, label: 'dog spot' },
  { x: 205, y: 306, r: 16, label: 'flower colour' },
  { x: 361, y: 82, r: 20, label: 'extra cloud' },
  { x: 96, y: 168, r: 12, label: 'apple' },
];

// ---------------------------------------------------------------------------
// Scene 2 — Cozy Kitchen. 6 differences, 75 seconds.
// ---------------------------------------------------------------------------
function drawKitchen(ctx, variant) {
  // Warm wall and wooden floor.
  ctx.fillStyle = '#f7e8c9';
  ctx.fillRect(0, 0, PANEL_W, 280);
  ctx.fillStyle = '#b08954';
  ctx.fillRect(0, 280, PANEL_W, 80);
  ctx.strokeStyle = '#9a7443';
  ctx.lineWidth = 2;
  for (let y = 296; y < 360; y += 16) line(ctx, 0, y, PANEL_W, y, '#9a7443', 2);

  // Window with curtains, top left.
  rect(ctx, 55, 35, 150, 115, '#8ec9ee');
  rect(ctx, 55, 35, 150, 115, '#8ec9ee');
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 5;
  ctx.strokeRect(55, 35, 150, 115);
  line(ctx, 130, 35, 130, 150, '#6b4423', 4);
  line(ctx, 55, 92, 205, 92, '#6b4423', 4);
  circle(ctx, 90, 62, 16, '#ffd93b');
  cloud(ctx, 150, 60, 0.55);
  // Difference 6: a little bird sits outside the window on the left only.
  if (variant === 0) {
    ellipse(ctx, 168, 122, 12, 7, '#4a6fa5');
    circle(ctx, 178, 118, 5, '#4a6fa5');
    poly(ctx, [[182, 118], [188, 120], [182, 122]], '#f2a541');
  }
  // Curtains.
  ctx.fillStyle = '#e26d5a';
  ctx.beginPath();
  ctx.moveTo(55, 35);
  ctx.lineTo(85, 35);
  ctx.lineTo(78, 150);
  ctx.lineTo(55, 150);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(205, 35);
  ctx.lineTo(175, 35);
  ctx.lineTo(182, 150);
  ctx.lineTo(205, 150);
  ctx.closePath();
  ctx.fill();

  // Wall clock. Difference 1: 3 o'clock on the left, half past 4 on the right.
  circle(ctx, 335, 62, 30, '#ffffff');
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(335, 62, 30, 0, Math.PI * 2);
  ctx.stroke();
  if (variant === 0) {
    line(ctx, 335, 62, 335, 42, '#333333', 3);
    line(ctx, 335, 62, 355, 62, '#333333', 3);
  } else {
    line(ctx, 335, 62, 346, 78, '#333333', 3);
    line(ctx, 335, 62, 320, 72, '#333333', 3);
  }
  circle(ctx, 335, 62, 3, '#333333');

  // Shelf with jars, top right.
  rect(ctx, 400, 100, 70, 8, '#8a5a2b');
  rect(ctx, 408, 76, 18, 24, '#7fb069');
  rect(ctx, 432, 76, 18, 24, '#e07a5f');
  rect(ctx, 452, 76, 12, 24, '#f2c14e');

  // Counter.
  rect(ctx, 0, 280, PANEL_W, 14, '#8a5a2b');
  rect(ctx, 0, 294, PANEL_W, 66, '#a9713f');

  // Kettle on the stove. Difference 4: steam rises on the left only.
  ellipse(ctx, 205, 258, 30, 20, '#4a6fa5');
  poly(ctx, [[205, 238], [215, 222], [225, 238]], '#4a6fa5');
  circle(ctx, 215, 220, 4, '#333333');
  line(ctx, 232, 248, 246, 238, '#4a6fa5', 6);
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(215, 212);
    ctx.quadraticCurveTo(208, 200, 216, 190);
    ctx.quadraticCurveTo(222, 182, 216, 172);
    ctx.stroke();
  }

  // Fruit bowl. Difference 2: three apples on the left, two on the right.
  ellipse(ctx, 350, 292, 34, 12, '#e07a5f');
  circle(ctx, 336, 282, 9, '#e14b4b');
  circle(ctx, 362, 282, 9, '#e14b4b');
  if (variant === 0) circle(ctx, 349, 272, 9, '#e14b4b');
  line(ctx, 349, 264, 352, 258, '#2e7d32', 2);

  // Cat on a chair. Difference 3: stripes on its back on the left only.
  rect(ctx, 92, 300, 70, 10, '#8a5a2b');
  rect(ctx, 100, 310, 8, 34, '#6b4423');
  rect(ctx, 146, 310, 8, 34, '#6b4423');
  ellipse(ctx, 128, 292, 24, 16, '#9aa0a6');
  circle(ctx, 148, 280, 12, '#9aa0a6');
  poly(ctx, [[142, 272], [146, 262], [150, 272]], '#9aa0a6');
  poly(ctx, [[152, 272], [156, 262], [160, 272]], '#9aa0a6');
  line(ctx, 106, 292, 92, 282, '#9aa0a6', 5);
  circle(ctx, 152, 278, 2, '#222222');
  if (variant === 0) {
    line(ctx, 116, 280, 116, 296, '#6b7280', 3);
    line(ctx, 128, 278, 128, 296, '#6b7280', 3);
    line(ctx, 140, 280, 140, 296, '#6b7280', 3);
  }

  // Potted plant. Difference 5: five leaves on the left, four on the right.
  poly(ctx, [[420, 268], [440, 268], [436, 292], [424, 292]], '#e07a5f');
  line(ctx, 430, 268, 430, 240, '#2e7d32', 3);
  ellipse(ctx, 418, 246, 7, 14, '#3f9e4d');
  ellipse(ctx, 442, 246, 7, 14, '#3f9e4d');
  ellipse(ctx, 430, 234, 7, 14, '#57b866');
  if (variant === 0) {
    ellipse(ctx, 410, 258, 6, 11, '#3f9e4d');
    ellipse(ctx, 450, 258, 6, 11, '#3f9e4d');
  } else {
    ellipse(ctx, 410, 258, 6, 11, '#3f9e4d');
  }

  // Striped rug.
  ellipse(ctx, 250, 336, 70, 14, '#e26d5a');
  ctx.fillStyle = '#f2c14e';
  ctx.beginPath();
  ctx.ellipse(250, 336, 70, 14, 0, Math.PI * 0.15, Math.PI * 0.5);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(250, 336, 70, 14, 0, Math.PI * 0.65, Math.PI * 0.95);
  ctx.fill();
}

const KITCHEN_DIFFS = [
  { x: 335, y: 62, r: 30, label: 'clock hands' },
  { x: 349, y: 272, r: 14, label: 'apple in bowl' },
  { x: 128, y: 287, r: 20, label: 'cat stripes' },
  { x: 215, y: 192, r: 18, label: 'kettle steam' },
  { x: 450, y: 258, r: 12, label: 'plant leaf' },
  { x: 172, y: 120, r: 14, label: 'bird at window' },
];

// ---------------------------------------------------------------------------
// Scene 3 — Space Station. 7 differences, 60 seconds.
// ---------------------------------------------------------------------------
function drawSpace(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#070726');
  sky.addColorStop(1, '#1c1c50');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Fixed stars.
  const stars = [[40, 40], [90, 120], [150, 30], [210, 90], [260, 40], [300, 130], [360, 30], [420, 120], [455, 60], [60, 200], [180, 160], [250, 300], [330, 320], [410, 280], [30, 300], [470, 200], [120, 320], [290, 200]];
  ctx.fillStyle = '#ffffff';
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Difference 4: a shooting star on the left only.
  if (variant === 0) {
    line(ctx, 200, 48, 232, 66, '#ffffff', 2);
    circle(ctx, 232, 66, 3, '#ffffff');
  }

  // Ringed planet, top left. Difference 2: rings on the left only.
  circle(ctx, 100, 92, 38, '#c96f4a');
  ellipse(ctx, 100, 92, 20, 10, '#a85438');
  circle(ctx, 88, 82, 8, '#d98a63');
  if (variant === 0) {
    ctx.strokeStyle = '#e8c39a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(100, 92, 56, 14, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Earth, top right. Difference 6: clouds on the left only.
  circle(ctx, 402, 70, 28, '#3b82c4');
  ellipse(ctx, 394, 62, 14, 8, '#2e9e5b');
  ellipse(ctx, 410, 80, 10, 6, '#2e9e5b');
  if (variant === 0) {
    ellipse(ctx, 396, 74, 12, 4, 'rgba(255,255,255,0.85)');
    ellipse(ctx, 410, 62, 10, 4, 'rgba(255,255,255,0.85)');
  }

  // Space station module, bottom left. Difference 7: window lit on the left.
  rect(ctx, 48, 250, 90, 34, '#b8bcc4');
  rect(ctx, 48, 250, 90, 8, '#9aa0a8');
  circle(ctx, 74, 267, 9, variant === 0 ? '#ffd93b' : '#3a3f4a');
  circle(ctx, 108, 267, 9, '#ffd93b');
  line(ctx, 138, 258, 160, 250, '#8a8f98', 4);
  circle(ctx, 162, 249, 4, '#e14b4b');

  // Rocket, centre. Difference 1: flame on the left only.
  poly(ctx, [[240, 150], [256, 180], [240, 210], [224, 180]], '#e8e8e8');
  poly(ctx, [[240, 150], [248, 168], [232, 168]], '#e14b4b');
  circle(ctx, 240, 182, 7, '#7ec8f7');
  poly(ctx, [[226, 196], [214, 214], [228, 208]], '#e14b4b');
  poly(ctx, [[254, 196], [266, 214], [252, 208]], '#e14b4b');
  if (variant === 0) {
    poly(ctx, [[240, 212], [250, 236], [240, 230], [230, 236]], '#f2a541');
    poly(ctx, [[240, 216], [246, 230], [240, 226], [234, 230]], '#ffd93b');
  }

  // Satellite, right. Difference 5: the dish points up on the left, down on the right.
  rect(ctx, 388, 196, 26, 16, '#c0c4cc');
  rect(ctx, 372, 200, 16, 6, '#7f8ea3');
  rect(ctx, 414, 200, 16, 6, '#7f8ea3');
  if (variant === 0) {
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(401, 190, 12, Math.PI, Math.PI * 2);
    ctx.stroke();
    line(ctx, 401, 196, 401, 184, '#e8e8e8', 3);
  } else {
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(401, 218, 12, 0, Math.PI);
    ctx.stroke();
    line(ctx, 401, 212, 401, 224, '#e8e8e8', 3);
  }

  // Astronaut, bottom right, tethered to the station.
  ctx.strokeStyle = '#d8d8d8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 262);
  ctx.quadraticCurveTo(240, 300, 320, 268);
  ctx.stroke();
  ellipse(ctx, 336, 262, 18, 24, '#f2f2f2');
  circle(ctx, 336, 232, 14, '#f2f2f2');
  // Difference 3: the helmet light glows on the left, dark on the right.
  circle(ctx, 348, 228, 5, variant === 0 ? '#ffd93b' : '#3a3f4a');
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255,217,59,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(348, 228, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, 340, 250, 8, 14, '#d8d8d8');
  rect(ctx, 322, 252, 10, 22, '#e8e8e8');
  rect(ctx, 344, 252, 10, 22, '#e8e8e8');
  line(ctx, 322, 276, 316, 290, '#e8e8e8', 6);
  line(ctx, 350, 276, 356, 290, '#e8e8e8', 6);
}

const SPACE_DIFFS = [
  { x: 240, y: 228, r: 18, label: 'rocket flame' },
  { x: 100, y: 92, r: 34, label: 'planet rings' },
  { x: 348, y: 228, r: 12, label: 'helmet light' },
  { x: 216, y: 57, r: 18, label: 'shooting star' },
  { x: 401, y: 196, r: 16, label: 'satellite dish' },
  { x: 402, y: 70, r: 26, label: 'earth clouds' },
  { x: 74, y: 267, r: 12, label: 'station window' },
];

// ---------------------------------------------------------------------------
// The three rounds, in order. Time limits tighten as the scenes get busier.
// ---------------------------------------------------------------------------
export const SCENES = [
  { name: 'Sunny Park', timeLimit: 90, draw: drawPark, diffs: PARK_DIFFS },
  { name: 'Cozy Kitchen', timeLimit: 75, draw: drawKitchen, diffs: KITCHEN_DIFFS },
  { name: 'Space Station', timeLimit: 60, draw: drawSpace, diffs: SPACE_DIFFS },
];
