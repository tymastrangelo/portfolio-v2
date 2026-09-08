/* =============================================================================
   EWOK HOP — a tiny Doodle-Jump-style vertical bouncer set in the Endor canopy.
   Vanilla JS + Canvas 2D. No build step, no dependencies.

   Layout of this file:
     1. Config & tunables      2. Canvas / responsive sizing
     3. Audio                  4. Input
     5. World objects          6. Level generation
     7. Update (physics)       8. Draw (background -> world -> HUD)
     9. Game loop & states
   ========================================================================== */

'use strict';

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// -----------------------------------------------------------------------------
// 1. CONFIG & TUNABLES
// -----------------------------------------------------------------------------

// Fixed logical play field. All game math uses these coordinates; the canvas is
// scaled to fit whatever screen we're on, so tuning stays stable everywhere.
const W = 400;          // logical width is fixed, so movement tuning is stable
let H = 700;            // logical height follows the viewport aspect (see resize)
const H_MIN = 700, H_MAX = 1000;   // desktop lands on H_MIN; tall phones go taller

const GRAVITY       = 0.42;   // px/frame^2 (frames are normalised to 60fps)
const BOUNCE_VY     = -13.2;  // normal bounce -> ~207px of rise
const SUPER_VY      = -21.0;  // mushroom bounce -> ~525px of rise
const MAX_VX        = 5.4;    // horizontal top speed
const ACCEL         = 0.85;   // how fast we reach top speed
const FRICTION      = 0.86;   // slowdown when no key is held
const CAM_TRIGGER   = 0.40;   // scroll once the Ewok is above the top 40%

const PLAYER_W = 30;          // hitbox (narrower than the sprite, feels fairer)
const PLAYER_H = 46;
const SPRITE_W = 20;          // one cell of assets/ewoks.png
const SPRITE_H = 27;
const SPRITE_SCALE = 2;       // one art pixel = two logical px, like the scenery
const EWOKS = ['WICKET', 'TEEBO', 'PAPLOO', 'LOGRAY'];

const PLAT_W = 68;
const PLAT_H = 14;
const GAP_MIN_EASY = 62;      // vertical spacing between platforms...
const GAP_MAX_EASY = 100;
const GAP_MIN_HARD = 95;      // ...widens as you climb
const GAP_MAX_HARD = 150;
const DIFFICULTY_RUN = 14000; // px of climb to reach full difficulty

const BERRY_CHANCE  = 0.14;
const HAZARD_CHANCE = 0.07;   // spore clouds, only once you're up high
const HAZARD_START  = 1600;   // px climbed before hazards appear
const HAZARD_PENALTY = 5;
const CRUMBLE_GAP   = 88;     // max gap either side of a crumbling log

// Endor forest palette (the sky itself is handled by the day/night cycle below).
const C = {
  bark:     '#6b4f33',
  barkDark: '#4a3722',
  moss:     '#5f8a4a',
  mossDark: '#3d6130',
  vine:     '#7fa356',
  mush:     '#c4553f',
  mushPale: '#e9d7b8',
  maroon:   '#5c2b2b',
  maroonLt: '#8c4040',
  berry:    '#c8425c',
  cream:    '#e8dcc8',
  firefly:  '#ffe9a3',
  spore:    '#9d8fc4',
  rope:     '#b79a6a',
};

/* --- day/night cycle -------------------------------------------------------
   The sky walks through these keyframes as you climb, looping forever, so a
   long run drifts from dusk into night, up through dawn and back round to
   evening. Each entry is four gradient stops (top -> horizon), the two tree
   silhouette tones for that time of day, how visible the stars/fireflies are,
   and the colour the village windows glow.                                   */
const SKIES = [
  // stops: sky gradient, top -> horizon.  bark/leaf: the far and near canopy
  // layers.  star: how visible stars and fireflies are.  glow: window light.
  { stops: ['#182036', '#2f3054', '#4f3f57', '#70504a'],
    bark: ['#3b2f3e', '#291f28'], leaf: ['#2c3a33', '#1d2820'], star: 0.65, glow: '#ffbe74' }, // dusk
  { stops: ['#05070f', '#0d1428', '#182036', '#2b2740'],
    bark: ['#1c1b27', '#12111a'], leaf: ['#161f22', '#0e1416'], star: 1.00, glow: '#ffd9a0' }, // night
  { stops: ['#231d40', '#4d3459', '#9c5a55', '#e0956d'],
    bark: ['#4b3746', '#33252f'], leaf: ['#3a4038', '#252b24'], star: 0.30, glow: '#ffe6b0' }, // dawn
  { stops: ['#4a86b8', '#7bb0cc', '#a6c68f', '#cbd8a2'],
    bark: ['#6d5239', '#4a3626'], leaf: ['#4f7143', '#33502c'], star: 0.00, glow: '#fff4d0' }, // day
  { stops: ['#35618f', '#8a8168', '#cf9a58', '#e6ad6d'],
    bark: ['#7b5736', '#513622'], leaf: ['#5b6735', '#3b4522'], star: 0.06, glow: '#ffd28a' }, // golden hour
];
const PHASE_CLIMB = 4200;   // px of climbing per sky keyframe

const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const SKY_RGB = SKIES.map((s) => ({
  stops: s.stops.map(hex2rgb), bark: s.bark.map(hex2rgb), leaf: s.leaf.map(hex2rgb),
  star: s.star, glow: hex2rgb(s.glow),
}));

const mixRGB = (a, b, t) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;

// Resolved once per frame and reused by every background layer.
let sky = { stops: [], bark: [], leaf: [], star: 1, glow: '#ffd9a0' };
let skyClimb = 0;   // smoothed climb height that actually drives the cycle

function updateSky(dt) {
  // Height climbed only ever ratchets upward, a whole bounce at a time, so
  // feeding it straight into the gradient makes the sky jump every time you
  // land. Chase it with a slow lag instead and the light always glides.
  const target = state === 'TITLE' ? titleTime * 3 : Math.max(0, startY - highestY);
  if (state === 'TITLE') skyClimb = target;
  else skyClimb += (target - skyClimb) * Math.min(1, 0.02 * dt);

  const p = (skyClimb / PHASE_CLIMB) % SKY_RGB.length;
  const i = Math.floor(p);
  const raw = p - i;
  // Ease the blend so each time of day settles in and out rather than sliding
  // at a constant rate through the middle of the transition.
  const f = raw * raw * (3 - 2 * raw);
  const a = SKY_RGB[i], b = SKY_RGB[(i + 1) % SKY_RGB.length];
  sky.stops = a.stops.map((c, k) => mixRGB(c, b.stops[k], f));
  sky.bark  = a.bark.map((c, k) => mixRGB(c, b.bark[k], f));
  sky.leaf  = a.leaf.map((c, k) => mixRGB(c, b.leaf[k], f));
  sky.star = a.star + (b.star - a.star) * f;
  sky.glow = mixRGB(a.glow, b.glow, f);   // was a hard swap, which popped
}

// -----------------------------------------------------------------------------
// 2. CANVAS / RESPONSIVE SIZING
// -----------------------------------------------------------------------------

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// The canvas element is sized in CSS pixels to fill as much of the window as it
// can while keeping the 400:700 portrait ratio, then given a device-pixel-ratio
// backing store. A single transform maps our fixed 400x700 logical space onto
// it, so the rest of the code never thinks about screen size.
function resize() {
  const pad = window.innerWidth <= 560 || window.innerHeight <= 560 ? 0 : 24;
  const availW = window.innerWidth - pad;
  const availH = window.innerHeight - pad;

  // Let the play field grow taller or shorter to match the screen it's on, so
  // a phone gets a full-bleed portrait field and a laptop gets a taller one,
  // instead of either being letterboxed. Width stays at 400 so how far the
  // Ewok can travel per bounce never changes.
  H = clamp(Math.round(W * (availH / availW)), H_MIN, H_MAX);

  const scale = Math.min(availW / W, availH / H);
  const cssW = Math.floor(W * scale);
  const cssH = Math.floor(H * scale);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform((cssW / W) * dpr, 0, 0, (cssH / H) * dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;  // keep the pixel art crisp
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
resize();

// Ewok sprite. If it's missing we fall back to drawing a simple blob so the
// game still runs rather than showing nothing.
const ewokImg = new Image();
let ewokReady = false;
ewokImg.onload = () => { ewokReady = true; };
ewokImg.src = 'assets/ewoks.png';   // the four characters, side by side

// Which character is in play. Chosen on the title screen, remembered after.
let ewokIndex = clamp(parseInt(localStorage.getItem('ewokhop.ewok') || '0', 10) || 0, 0, EWOKS.length - 1);
function setEwok(i) {
  ewokIndex = (i + EWOKS.length) % EWOKS.length;
  localStorage.setItem('ewokhop.ewok', String(ewokIndex));
  beep(520 + ewokIndex * 60, 0.07, 'triangle', 0.10);
}

// -----------------------------------------------------------------------------
// 3. AUDIO — tiny Web Audio blips, created on demand so we never need files.
// -----------------------------------------------------------------------------

let audioCtx = null;
let muted = localStorage.getItem('ewokhop.muted') === '1';

function beep(freq, dur, type = 'square', vol = 0.12, slideTo = null) {
  if (muted) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch (e) { /* audio is a nicety, never a failure */ }
}

const sfx = {
  bounce:  () => beep(320, 0.13, 'square', 0.10, 620),
  super:   () => beep(300, 0.28, 'square', 0.13, 1100),
  berry:   () => { beep(880, 0.08, 'triangle', 0.14); setTimeout(() => beep(1320, 0.10, 'triangle', 0.12), 70); },
  crumble: () => beep(180, 0.16, 'sawtooth', 0.07, 90),
  hazard:  () => beep(240, 0.22, 'sawtooth', 0.09, 120),
  over:    () => { beep(400, 0.18, 'square', 0.12, 260); setTimeout(() => beep(240, 0.35, 'square', 0.12, 110), 160); },
};

function toggleMute() {
  muted = !muted;
  localStorage.setItem('ewokhop.muted', muted ? '1' : '0');
  if (!muted) beep(660, 0.08, 'triangle', 0.10);
}

// -----------------------------------------------------------------------------
// 4. INPUT
// -----------------------------------------------------------------------------

const keys = { left: false, right: false };
let touchDX = 0;        // horizontal drag applied this frame
let lastTouchX = null;

// Where the mute button sits (logical coords) — hit-tested on click/tap.
const MUTE_BOX = { x: W - 38, y: 12, w: 26, h: 26 };

function pointerToLogical(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return { x: (clientX - r.left) * (W / r.width), y: (clientY - r.top) * (H / r.height) };
}

window.addEventListener('keydown', (e) => {
  // On the title screen the arrows pick a character instead of steering.
  if (state === 'TITLE') {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { setEwok(ewokIndex - 1); return; }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { setEwok(ewokIndex + 1); return; }
  }
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  if (e.key === 'm' || e.key === 'M') toggleMute();
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); confirmAction(); }
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

// Mouse is only needed for the menus.
canvas.addEventListener('click', (e) => {
  const p = pointerToLogical(e.clientX, e.clientY);
  if (hitMute(p)) { toggleMute(); return; }
  if (state === 'TITLE') {
    const d = pickerHit(p);
    if (d) { setEwok(ewokIndex + d); return; }
  }
  confirmAction();
});

// Touch: tap to start/restart, drag left-right to steer.
canvas.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  const p = pointerToLogical(t.clientX, t.clientY);
  if (hitMute(p)) { e.preventDefault(); toggleMute(); return; }
  if (state === 'TITLE') {
    const d = pickerHit(p);
    if (d) { e.preventDefault(); setEwok(ewokIndex + d); return; }
  }
  lastTouchX = t.clientX;
  if (state !== 'PLAYING') { e.preventDefault(); confirmAction(); }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  const t = e.changedTouches[0];
  if (lastTouchX !== null) {
    const r = canvas.getBoundingClientRect();
    touchDX += (t.clientX - lastTouchX) * (W / r.width);
  }
  lastTouchX = t.clientX;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', () => { lastTouchX = null; });
canvas.addEventListener('touchcancel', () => { lastTouchX = null; });

function hitMute(p) {
  return p.x >= MUTE_BOX.x - 6 && p.x <= MUTE_BOX.x + MUTE_BOX.w + 6 &&
         p.y >= MUTE_BOX.y - 6 && p.y <= MUTE_BOX.y + MUTE_BOX.h + 6;
}

// Space / Enter / click / tap all mean "the one obvious thing" for this screen.
function confirmAction() {
  if (state === 'TITLE') startGame();
  else if (state === 'GAME_OVER' && overTimer > 30) startGame();
}

// -----------------------------------------------------------------------------
// 5. WORLD OBJECTS & STATE
// -----------------------------------------------------------------------------

let state = 'TITLE';          // TITLE | PLAYING | GAME_OVER
let player, platforms, berries, hazards, particles, floaters;
let camY;                     // world-y of the top edge of the screen
let highestY;                 // best (smallest) world-y the player has reached
let startY;                   // world-y the run began at
let score, berryScore, highScore, newRecord;
let shake, overTimer, titleTime;

highScore = parseInt(localStorage.getItem('ewokhop.highscore') || '0', 10) || 0;

// The Ewok on the title screen paces left and right so the menu shows off the
// walk cycle and the turn-around.
const titleEwok = { vx: 0, vy: -3, face: 1, pendingFace: 1, turnT: 0, anim: 0, squash: 0 };

// Slow-drifting fireflies. They live in screen space with a parallax factor so
// they keep gently filling the frame no matter how far you've climbed.
const fireflies = Array.from({ length: 26 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: 0.8 + Math.random() * 1.6,
  vx: (Math.random() - 0.5) * 0.25,
  vy: (Math.random() - 0.5) * 0.25,
  phase: Math.random() * Math.PI * 2,
  speed: 0.02 + Math.random() * 0.03,
}));

function startGame() {
  player = {
    x: W / 2 - PLAYER_W / 2,
    y: H - 200,
    vx: 0, vy: 0,
    face: 1,          // 1 = right, -1 = left
    pendingFace: 1,   // face to snap to halfway through a turn
    turnT: 0,         // >0 while the turn-around pivot plays
    anim: 0,          // leg-cycle phase
    squash: 0,        // >0 right after a landing
  };
  platforms = [];
  berries = [];
  hazards = [];
  particles = [];
  floaters = [];
  camY = 0;
  startY = player.y;
  highestY = player.y;
  score = 0;
  berryScore = 0;
  skyClimb = 0;
  newRecord = false;
  shake = 0;
  overTimer = 0;

  // A wide, safe branch to start on, then fill the first screen.
  topPlat = makePlatform(W / 2 - 45, H - 120, 'normal', 90);
  nonSolidRun = 0;
  platforms.push(topPlat);
  while (topPlat.y > camY - H) spawnNext(0);
  state = 'PLAYING';
}

function makePlatform(x, y, type, w = PLAT_W) {
  return {
    x, y, w, h: PLAT_H, type,
    x0: x,                // swaying branches stay near where they were placed
    sway: 34 + Math.random() * 22,
    dir: Math.random() < 0.5 ? -1 : 1,
    speed: 0.6 + Math.random() * 0.9,
    breaking: 0,          // counts up once a crumbling log has been stepped on
    squish: 0,            // visual reaction to being landed on
  };
}


// -----------------------------------------------------------------------------
// 6. LEVEL GENERATION
// -----------------------------------------------------------------------------

// 0 = just started, 1 = as hard as it gets.
function difficulty() {
  return clamp((startY - highestY) / DIFFICULTY_RUN, 0, 1);
}

/* How far the Ewok can travel sideways during one bounce that clears `gap`.
   He leaves a platform at BOUNCE_VY and is back at that height, descending,
   after `air` frames; in that window he accelerates up to MAX_VX. Generation
   uses this so it can never place a platform that no input could reach. */
function reachX(gap) {
  const disc = BOUNCE_VY * BOUNCE_VY - 2 * GRAVITY * gap;
  if (disc <= 0) return 0;                       // gap is above the jump ceiling
  const air = (Math.abs(BOUNCE_VY) + Math.sqrt(disc)) / GRAVITY;
  const spin = MAX_VX / ACCEL;                   // frames spent getting up to speed
  return air <= spin ? 0.5 * ACCEL * air * air
                     : 0.5 * ACCEL * spin * spin + MAX_VX * (air - spin);
}

// The highest platform placed so far, and how many non-solid ones we've put in
// a row — both drive the rules in nextType/spawnNext below.
let topPlat = null;
let nonSolidRun = 0;

function pickType(t) {
  // Normal platforms give way to moving/crumbling ones as you climb. Bounce
  // mushrooms stay roughly constant so the run never becomes unwinnable.
  const bounce  = 0.08;
  const moving  = 0.06 + 0.20 * t;
  const crumble = 0.05 + 0.24 * t;
  const r = Math.random();
  if (r < bounce) return 'bounce';
  if (r < bounce + moving) return 'moving';
  if (r < bounce + moving + crumble) return 'crumble';
  return 'normal';
}

function nextType(t) {
  // Never stack more than two dodgy platforms in a row, and always put solid
  // footing directly above a crumbling log — otherwise a run can hand you a
  // ladder of things that vanish underneath you.
  if (nonSolidRun >= 2 || (topPlat && topPlat.type === 'crumble')) {
    return Math.random() < 0.15 ? 'bounce' : 'normal';
  }
  return pickType(t);
}

// Place the next platform above `topPlat`, along with any berry or spore cloud
// that comes with it.
function spawnNext(t) {
  const type = nextType(t);

  let gap = rand(
    GAP_MIN_EASY + (GAP_MIN_HARD - GAP_MIN_EASY) * t,
    GAP_MAX_EASY + (GAP_MAX_HARD - GAP_MAX_EASY) * t
  );
  // A crumbling log leaves a hole when it goes. Keep the gaps on both sides of
  // one tight, so the combined drop it leaves behind is still jumpable rather
  // than a guaranteed death on the way back down.
  if (type === 'crumble' || (topPlat && topPlat.type === 'crumble')) {
    gap = Math.min(gap, CRUMBLE_GAP);
  }

  const y = topPlat.y - gap;
  const pw = Math.round(PLAT_W - 16 * t);   // branches get thinner as you climb

  // Keep the next platform within the sideways distance this bounce actually
  // affords, counting the screen wrap as the shortcut it is.
  const span = Math.max(40, reachX(gap) * 0.72);
  let cx = topPlat.x + topPlat.w / 2 + rand(-span, span);
  cx = ((cx % W) + W) % W;
  const x = clamp(cx - pw / 2, 6, W - pw - 6);

  const p = makePlatform(x, y, type, pw);
  platforms.push(p);
  topPlat = p;
  nonSolidRun = (type === 'crumble' || type === 'moving') ? nonSolidRun + 1 : 0;

  if (Math.random() < BERRY_CHANCE) {
    berries.push({
      x: p.x + p.w / 2 + rand(-18, 18),
      y: y - rand(26, 46),
      taken: false, pop: 0, bob: Math.random() * Math.PI * 2,
    });
  }

  if ((startY - y) > HAZARD_START && Math.random() < HAZARD_CHANCE * t + 0.02) {
    hazards.push({
      x: rand(40, W - 40),
      y: y - rand(20, 50),
      r: 20 + Math.random() * 10,
      vx: (Math.random() < 0.5 ? -1 : 1) * rand(0.25, 0.7),
      phase: Math.random() * Math.PI * 2,
      hitCooldown: 0,
    });
  }
  return p;
}

// Keep the world stocked above the camera and drop anything far below it.
function generate() {
  const t = difficulty();
  while (topPlat.y > camY - 120) spawnNext(t);

  const cutoff = camY + H + 120;
  platforms = platforms.filter((p) => p.y < cutoff);
  berries   = berries.filter((b) => b.y < cutoff && !(b.taken && b.pop > 1));
  hazards   = hazards.filter((h) => h.y < cutoff);
}

// -----------------------------------------------------------------------------
// 7. UPDATE
// -----------------------------------------------------------------------------

function update(dt) {
  titleTime += dt;
  updateSky(dt);

  // Fireflies drift on every screen, including the menus.
  for (const f of fireflies) {
    f.x += f.vx * dt; f.y += f.vy * dt; f.phase += f.speed * dt;
    if (f.x < -5) f.x = W + 5; if (f.x > W + 5) f.x = -5;
    if (f.y < -5) f.y = H + 5; if (f.y > H + 5) f.y = -5;
  }

  if (state === 'TITLE') stepPose(titleEwok, Math.sin(titleTime * 0.016) * 4, -3, dt);
  if (state === 'GAME_OVER') overTimer += dt;
  if (state !== 'PLAYING') { touchDX = 0; return; }

  // --- horizontal movement -------------------------------------------------
  if (keys.left)  player.vx -= ACCEL * dt;
  if (keys.right) player.vx += ACCEL * dt;
  if (!keys.left && !keys.right) player.vx *= Math.pow(FRICTION, dt);
  player.vx = clamp(player.vx, -MAX_VX, MAX_VX);
  player.x += player.vx * dt + touchDX;
  if (touchDX !== 0) player.vx = clamp(touchDX, -MAX_VX, MAX_VX);
  stepPose(player, player.vx, player.vy, dt);
  touchDX = 0;

  /* Edge wrap. There is only ever one Ewok on screen and he is never sliced by
     a screen edge: he is held fully inside the field, and the moment his
     sprite touches one edge he is placed against the opposite one. Drawing a
     second copy across the seam would be smoother in the abstract, but it puts
     two half-Ewoks on screen at once, which reads as a glitch. */
  const half = (SPRITE_W * SPRITE_SCALE) / 2;
  const pcx = player.x + PLAYER_W / 2;
  if (pcx - half < 0) player.x = W - half - PLAYER_W / 2;
  else if (pcx + half > W) player.x = half - PLAYER_W / 2;

  // --- vertical movement & platform collision ------------------------------
  const prevBottom = player.y + PLAYER_H;
  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;
  const bottom = player.y + PLAYER_H;

  for (const p of platforms) {
    if (p.type === 'moving') {
      p.x += p.dir * p.speed * (1 + difficulty() * 0.9) * dt;
      const lo = Math.max(4, p.x0 - p.sway), hi = Math.min(W - p.w - 4, p.x0 + p.sway);
      if (p.x < lo) { p.x = lo; p.dir = 1; }
      if (p.x > hi) { p.x = hi; p.dir = -1; }
    }
    if (p.breaking > 0) p.breaking += dt;
    if (p.squish > 0) p.squish = Math.max(0, p.squish - 0.08 * dt);
  }

  for (const p of platforms) {
    // Only land when falling, and only if the feet crossed the platform top
    // during this frame (stops us tunnelling through at high speed).
    if (player.vy <= 0) break;
    if (p.breaking > 14) continue;
    if (prevBottom > p.y + 8) continue;
    if (bottom < p.y) continue;
    if (player.x + PLAYER_W < p.x + 3 || player.x > p.x + p.w - 3) continue;

    land(p);
    break;
  }

  // Drop crumbled logs once their brief break animation has played.
  platforms = platforms.filter((p) => p.breaking <= 22);

  // --- camera --------------------------------------------------------------
  const trigger = camY + H * CAM_TRIGGER;
  if (player.y < trigger) camY = player.y - H * CAM_TRIGGER;
  if (player.y < highestY) highestY = player.y;

  // --- berries -------------------------------------------------------------
  for (const b of berries) {
    b.bob += 0.06 * dt;
    if (b.taken) { b.pop += 0.07 * dt; continue; }
    const dx = (player.x + PLAYER_W / 2) - b.x;
    const dy = (player.y + PLAYER_H / 2) - b.y;
    if (dx * dx + dy * dy < 26 * 26) {
      b.taken = true;
      berryScore += 10;
      floaters.push({ x: b.x, y: b.y, text: '+10', life: 0, color: C.berry });
      burst(b.x, b.y, C.berry, 8);
      sfx.berry();
    }
  }

  // --- hazards (gentle: a small score nibble, never a death) ---------------
  for (const h of hazards) {
    h.x += h.vx * dt;
    h.phase += 0.03 * dt;
    if (h.x < h.r) { h.x = h.r; h.vx *= -1; }
    if (h.x > W - h.r) { h.x = W - h.r; h.vx *= -1; }
    if (h.hitCooldown > 0) { h.hitCooldown -= dt; continue; }
    const dx = (player.x + PLAYER_W / 2) - h.x;
    const dy = (player.y + PLAYER_H / 2) - h.y;
    if (dx * dx + dy * dy < (h.r + 14) * (h.r + 14)) {
      h.hitCooldown = 90;
      berryScore -= HAZARD_PENALTY;
      floaters.push({ x: h.x, y: h.y, text: '-' + HAZARD_PENALTY, life: 0, color: C.spore });
      burst(h.x, h.y, C.spore, 10);
      shake = Math.max(shake, 4);
      sfx.hazard();
    }
  }

  // --- particles & floating text ------------------------------------------
  for (const q of particles) {
    q.x += q.vx * dt; q.y += q.vy * dt;
    q.vy += 0.12 * dt;
    q.life -= dt;
  }
  particles = particles.filter((q) => q.life > 0);

  for (const f of floaters) { f.y -= 0.7 * dt; f.life += dt; }
  floaters = floaters.filter((f) => f.life < 60);

  if (player.squash > 0) player.squash = Math.max(0, player.squash - 0.07 * dt);
  if (shake > 0) shake = Math.max(0, shake - 0.35 * dt);

  // --- score & death -------------------------------------------------------
  score = Math.max(0, Math.floor((startY - highestY) / 10) + berryScore);
  generate();

  if (player.y - camY > H + 20) gameOver();
}

function land(p) {
  const superBounce = p.type === 'bounce';
  player.vy = superBounce ? SUPER_VY : BOUNCE_VY;
  player.y = p.y - PLAYER_H;
  player.squash = 1;
  p.squish = 1;

  if (p.type === 'crumble' && p.breaking === 0) { p.breaking = 0.001; sfx.crumble(); }

  if (superBounce) {
    shake = 7;
    burst(p.x + p.w / 2, p.y, C.mushPale, 14, 3.2);
    sfx.super();
  } else {
    burst(p.x + p.w / 2, p.y, C.mossDark, 4, 1.4);
    sfx.bounce();
  }
}

function burst(x, y, color, n, power = 2.2) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    particles.push({
      x, y, color,
      vx: Math.cos(a) * rand(0.4, power),
      vy: Math.sin(a) * rand(0.4, power) - 1,
      size: rand(1.5, 3.5),
      life: rand(20, 45),
    });
  }
}

function gameOver() {
  state = 'GAME_OVER';
  overTimer = 0;
  if (score > highScore) {
    highScore = score;
    newRecord = true;
    localStorage.setItem('ewokhop.highscore', String(highScore));
  }
  sfx.over();
}

// -----------------------------------------------------------------------------
// 8. DRAW
// -----------------------------------------------------------------------------

// Chunky pixel text: render small on an offscreen canvas, then blow it up with
// smoothing off. Gives real blocky letterforms without shipping a font file.
const textCanvas = document.createElement('canvas');
const tctx = textCanvas.getContext('2d', { willReadFrequently: true });

function pixelText(str, x, y, size, color, align = 'center', outline = '#141018') {
  // Draw small, then integer-upscale. The small size never drops below 11px —
  // below that the alpha threshold below eats the strokes and the text turns to
  // mush — so tiny labels get a smaller zoom instead of a smaller font.
  const small = Math.max(11, Math.round(size / 3.4));
  const zoom = Math.max(2, Math.round(size / small));

  tctx.font = `bold ${small}px "Courier New", monospace`;
  const w = Math.ceil(tctx.measureText(str).width) + 2;
  const h = small + 4;
  textCanvas.width = w; textCanvas.height = h;
  tctx.font = `bold ${small}px "Courier New", monospace`;
  tctx.textBaseline = 'top';
  tctx.fillStyle = color;
  tctx.fillText(str, 1, 2);

  // Hard-threshold the alpha so the blown-up letters have crisp pixel edges
  // instead of the browser's antialiased fringe.
  const img = tctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0;
  tctx.putImageData(img, 0, 0);

  const dw = w * zoom, dh = h * zoom;
  const dx = Math.round(align === 'center' ? x - dw / 2 : align === 'right' ? x - dw : x);
  const dy = Math.round(y);
  ctx.imageSmoothingEnabled = false;

  // A one-pixel dark outline around every glyph. The backdrop is a busy forest,
  // and without this the thinner text disappears into whatever is behind it.
  if (outline) {
    // Recolour the glyph mask to the outline colour and stamp it around.
    tctx.globalCompositeOperation = 'source-in';
    tctx.fillStyle = outline;
    tctx.fillRect(0, 0, w, h);
    tctx.globalCompositeOperation = 'source-over';
    for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.drawImage(textCanvas, 0, 0, w, h, dx + ox * zoom, dy + oy * zoom, dw, dh);
    }
    // Repaint the mask in the real colour for the fill pass.
    tctx.globalCompositeOperation = 'source-in';
    tctx.fillStyle = color;
    tctx.fillRect(0, 0, w, h);
    tctx.globalCompositeOperation = 'source-over';
  }

  ctx.drawImage(textCanvas, 0, 0, w, h, dx, dy, dw, dh);
}

function drawSky(scroll) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, sky.stops[0]);
  g.addColorStop(0.45, sky.stops[1]);
  g.addColorStop(0.8, sky.stops[2]);
  g.addColorStop(1, sky.stops[3]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Stars, fading in as night comes on. They drift very slowly so the sky
  // feels like part of the parallax rather than a decal.
  if (sky.star > 0.03) {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = hash(i * 3 + 1) * W;
      const sy = ((hash(i * 3 + 2) * H) + scroll * 0.05) % H;
      const tw = 0.55 + 0.45 * Math.sin(titleTime * 0.05 + i);
      ctx.globalAlpha = sky.star * 0.85 * tw * (0.4 + hash(i * 3 + 3) * 0.6);
      ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
    }
    ctx.globalAlpha = 1;
  }
}

// Deterministic pseudo-random so the forest is stable frame to frame.
const hash = (n) => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;

/* Two layers of the Endor canopy scrolling slower than the world: giant
   redwood trunks, branches and leaf clumps, and — on the nearer layer — the
   Ewok village itself, stilt huts and rope bridges strung between the trees,
   with windows that light up once night falls. */
function drawTrees(scroll) {
  const layers = [
    { f: 0.16, color: sky.bark[0], leaf: sky.leaf[0], count: 5, wmin: 16, wmax: 30, seed: 3,  village: false },
    { f: 0.36, color: sky.bark[1], leaf: sky.leaf[1], count: 4, wmin: 26, wmax: 46, seed: 17, village: true  },
  ];

  for (const L of layers) {
    // How far this layer has scrolled. Everything below is placed at a fixed
    // position in the layer's own world and then offset by this, rather than
    // being tiled into screen slots — otherwise a hut's identity would belong
    // to a slot on the screen instead of to the hut, and the whole village
    // would visibly change and jump every time the tiling wrapped round.
    const base = scroll * L.f;

    // Lay out this layer's trunks first so bridges can span between them.
    const trunks = [];
    for (let i = 0; i < L.count; i++) {
      const x = ((i + hash(i + L.seed) * 0.8) / L.count) * (W + 50) - 25;
      trunks.push({ x, w: L.wmin + hash(i + L.seed + 100) * (L.wmax - L.wmin), i });
    }

    for (const t of trunks) {
      ctx.fillStyle = L.color;
      ctx.fillRect(Math.round(t.x), 0, Math.round(t.w), H);
      // A lit edge and a shadowed edge give the trunk some roundness, and a
      // couple of bark grooves keep it from reading as a flat bar.
      ctx.fillStyle = 'rgba(255,236,200,0.05)';
      ctx.fillRect(Math.round(t.x + t.w * 0.18), 0, 3, H);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(Math.round(t.x + t.w - 4), 0, 4, H);
      ctx.fillRect(Math.round(t.x + t.w * 0.55), 0, 2, H);
      ctx.fillStyle = L.color;

      // Branches + leaf clumps.
      const step = 150 + hash(t.i + L.seed + 50) * 90;
      for (const b of slots(base, step)) {
        const by = Math.round(b * step + base);
        const right = (t.i + b) % 2 === 0;
        const bl = t.w * (0.9 + hash(t.i * 7 + b) * 1.0);
        ctx.fillRect(Math.round(right ? t.x + t.w : t.x - bl), by, Math.round(bl), 6);
        // Leaf clump at the branch tip, in foliage green rather than bark.
        const lx = right ? t.x + t.w + bl - 14 : t.x - bl - 8;
        ctx.fillStyle = L.leaf;
        ctx.fillRect(Math.round(lx), by - 12, 22, 8);
        ctx.fillRect(Math.round(lx + 3), by - 16, 16, 5);
        ctx.fillRect(Math.round(lx - 2), by - 6, 26, 6);
        ctx.fillStyle = L.color;
      }
    }

    if (!L.village) continue;

    // Rope bridges strung between neighbouring trunks.
    const bstep = 340;
    for (let k = 0; k < trunks.length - 1; k++) {
      const a = trunks[k], b = trunks[k + 1];
      for (const n of slots(base, bstep)) {
        drawBridge(a.x + a.w, b.x, Math.round(n * bstep + base + hash(k + 90) * 200), L.color);
      }
    }

    // Stilt huts clinging to the trunks.
    const hstep = 300;
    for (const t of trunks) {
      for (const n of slots(base, hstep)) {
        if (hash(t.i * 13 + n * 5 + 4) < 0.35) continue;   // not every slot has one
        const hw = 26 + hash(t.i * 3 + n) * 12;
        const right = (t.i + n) % 2 === 0;
        drawHut(right ? t.x + t.w - 2 : t.x - hw + 2,
                Math.round(n * hstep + base + hash(t.i + n) * 160), hw, L.color);
      }
    }
  }
}

// The world-space slot indices of a repeating background feature that are
// currently on screen. Indices are absolute, so a given hut/branch keeps the
// same index — and therefore the same size and shape — for its whole life.
function slots(base, step) {
  const out = [];
  const first = Math.floor((-base - 220) / step);
  const last  = Math.ceil((-base + H + 220) / step);
  for (let n = first; n <= last; n++) out.push(n);
  return out;
}

// A little thatched hut on stilts, in silhouette, with a window that glows
// when the sky is dark.
function drawHut(x, y, w, color) {
  const h = w * 0.66;
  x = Math.round(x); y = Math.round(y); w = Math.round(w);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, Math.round(h));                       // body
  ctx.fillRect(x - 4, y - 5, w + 8, 5);                       // thatch eaves
  ctx.fillRect(x - 1, y - 9, w + 2, 4);                       // thatch mid
  ctx.fillRect(Math.round(x + w * 0.32), y - 12, Math.round(w * 0.36), 3);
  ctx.fillRect(x + 3, y + h, 3, 9);                           // stilts
  ctx.fillRect(x + w - 6, y + h, 3, 9);

  if (sky.star > 0.06) {
    ctx.globalAlpha = Math.min(1, sky.star) * 0.9;
    ctx.fillStyle = sky.glow;
    ctx.fillRect(Math.round(x + w * 0.34), Math.round(y + h * 0.3), 5, 5);
    ctx.globalAlpha = Math.min(1, sky.star) * 0.16;           // soft spill
    ctx.fillRect(Math.round(x + w * 0.34) - 3, Math.round(y + h * 0.3) - 3, 11, 11);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
  }
}

// A sagging rope bridge: plank ticks along a catenary, with a hand rope above.
function drawBridge(x1, x2, y, color) {
  const span = x2 - x1;
  if (span < 14) return;
  ctx.fillStyle = color;
  for (let s = 0; s <= span; s += 5) {
    const t = s / span;
    const sag = Math.sin(t * Math.PI) * (span * 0.10);
    const px = Math.round(x1 + s), py = Math.round(y + sag);
    ctx.fillRect(px, py, 4, 3);        // plank
    ctx.fillRect(px, py - 8, 2, 1);    // hand rope
  }
}

function drawFireflies() {
  for (const f of fireflies) {
    const a = 0.28 + 0.45 * (0.5 + 0.5 * Math.sin(f.phase));
    ctx.globalAlpha = a;
    ctx.fillStyle = C.firefly;
    ctx.fillRect(Math.round(f.x), Math.round(f.y), Math.max(2, f.r * 2), Math.max(2, f.r * 2));
  }
  ctx.globalAlpha = 1;
}

function drawPlatform(p, sy) {
  const squish = p.squish * 3;
  const y = sy + squish;
  const h = PLAT_H - squish;

  if (p.breaking > 0) {
    // Crumbling: tilt apart and fade out.
    const t = p.breaking / 22;
    ctx.globalAlpha = 1 - t;
    ctx.save();
    ctx.translate(p.x + p.w / 2, y + h / 2);
    ctx.rotate(t * 0.5);
    ctx.translate(-p.w / 2, -h / 2);
    barkLog(0, 0, p.w, h, C.barkDark, C.vine);
    ctx.restore();
    ctx.globalAlpha = 1;
    return;
  }

  switch (p.type) {
    case 'moving':
      barkLog(p.x, y, p.w, h, C.bark, C.moss);
      // little sway lines, like leaves catching the wind
      ctx.fillStyle = C.moss;
      ctx.fillRect(p.x + 4, y - 3, 5, 3);
      ctx.fillRect(p.x + p.w - 12, y - 3, 5, 3);
      break;

    case 'crumble':
      barkLog(p.x, y, p.w, h, C.barkDark, C.vine);
      ctx.fillStyle = C.vine;               // dangling vines
      ctx.fillRect(p.x + 12, y + h, 3, 7);
      ctx.fillRect(p.x + p.w - 20, y + h, 3, 10);
      break;

    case 'bounce': {
      barkLog(p.x, y, p.w, h, C.bark, C.moss);
      // mushroom cap sitting on the branch
      const mx = p.x + p.w / 2, my = y - 2;
      ctx.fillStyle = C.mushPale;
      ctx.fillRect(mx - 5, my - 6, 10, 8);
      ctx.fillStyle = C.mush;
      ctx.fillRect(mx - 16, my - 14, 32, 9);
      ctx.fillRect(mx - 12, my - 18, 24, 5);
      ctx.fillStyle = C.mushPale;           // spots
      ctx.fillRect(mx - 10, my - 12, 4, 4);
      ctx.fillRect(mx + 5, my - 15, 4, 4);
      break;
    }

    default:
      barkLog(p.x, y, p.w, h, C.bark, C.moss);
  }
}

// One Ewok-village walkway: lashed planks, mossy top crust, dark underside.
function barkLog(x, y, w, h, bark, moss) {
  ctx.fillStyle = bark;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(x, y + h - 4, w, 4);
  // plank seams
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let s = 11; s < w - 4; s += 13) ctx.fillRect(x + s, y + 4, 1, h - 5);
  // rope lashings at both ends
  ctx.fillStyle = C.rope;
  ctx.fillRect(x + 3, y + 4, 2, h - 5);
  ctx.fillRect(x + w - 5, y + 4, 2, h - 5);
  ctx.fillStyle = moss;
  ctx.fillRect(x, y, w, 4);
  // a few moss tufts along the top for texture
  ctx.fillRect(x + 6, y - 2, 7, 2);
  ctx.fillRect(x + w - 18, y - 2, 9, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x + w * 0.35, y + 5, 6, 2);
}

function drawBerry(b, sy) {
  if (b.taken) {
    // quick scale-up + fade pop
    const t = clamp(b.pop, 0, 1);
    ctx.globalAlpha = 1 - t;
    const s = 5 + t * 12;
    ctx.fillStyle = C.berry;
    ctx.fillRect(b.x - s / 2, sy - s / 2, s, s);
    ctx.globalAlpha = 1;
    return;
  }
  const bob = Math.sin(b.bob) * 2;
  ctx.fillStyle = C.berry;
  ctx.fillRect(b.x - 4, sy - 4 + bob, 8, 8);
  ctx.fillStyle = '#ff8ba0';
  ctx.fillRect(b.x - 2, sy - 2 + bob, 2, 2);
  ctx.fillStyle = C.mossDark;                 // tiny stem
  ctx.fillRect(b.x - 1, sy - 8 + bob, 2, 3);
}

function drawHazard(h, sy) {
  const puff = Math.sin(h.phase) * 2;
  ctx.globalAlpha = h.hitCooldown > 0 ? 0.25 : 0.4;
  ctx.fillStyle = C.spore;
  for (let i = 0; i < 5; i++) {
    const a = h.phase + i * 1.256;
    const px = h.x + Math.cos(a) * (h.r * 0.5);
    const py = sy + Math.sin(a) * (h.r * 0.35);
    const s = h.r * 0.7 + puff;
    ctx.fillRect(px - s / 2, py - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}

/* The Ewok is one static 36x50 pose, so we fake a rig out of it: the sprite is
   drawn as horizontal bands (head / torso / legs) that can be offset
   independently, which gives kicking legs and a bobbing head from a single
   image. The spear runs the full height of the sprite, so the column it lives
   in is drawn rigidly and the bands only cover the body — otherwise the shaft
   would visibly kink between bands. */
const SP = {
  bodyW: 17,          // the body occupies x 0..16; the staff column is x 17..19
  headH: 15,          // rows 0..14  — hood, ears and face
  torsoY: 15, torsoH: 6,   // rows 15..20 — chest, arms, the grip, and the hips
  legsY: 21,  legsH: 6,    // rows 21..26 — the two legs and feet
  legSplit: 9,        // x that divides the left leg from the right
};

// Advance the pose of an Ewok-ish thing. Shared by the player and the little
// one pacing about on the title screen.
function stepPose(o, vx, vy, dt) {
  o.vx = vx; o.vy = vy;
  const want = Math.abs(vx) > 0.4 ? (vx > 0 ? 1 : -1) : o.face;
  // Facing flips on a single frame — that hard mirror is how pixel characters
  // turn. `turnT` only drives a short skid squash afterwards so the reversal
  // has some weight to it; it never interpolates the flip itself.
  if (want !== o.face) { o.face = want; o.turnT = 1; }
  if (o.turnT > 0) o.turnT = Math.max(0, o.turnT - 0.16 * dt);
  o.anim += (0.10 + Math.abs(vx) * 0.075) * dt;
}

function drawEwok(x, y, o, scale = 1) {
  // Squash-and-stretch: flatten right after a landing, stretch while rising.
  let sx = 1, sy = 1;
  if (o.squash > 0) {
    sx = 1 + 0.28 * o.squash;
    sy = 1 - 0.26 * o.squash;
  } else if (o.vy < -2) {
    const s = clamp(-o.vy * 0.014, 0, 0.24);
    sy = 1 + s; sx = 1 - s * 0.7;
  } else if (o.vy > 6) {
    sy = 1 + 0.08; sx = 1 - 0.06;
  }

  // Just-turned skid: a brief narrow-and-tall squash. The mirror itself already
  // happened on one frame, so this only adds weight to the change of direction.
  sx *= 1 - 0.14 * o.turnT;
  sy *= 1 + 0.07 * o.turnT;
  // The lean lags behind the flip (vx is still bleeding off in the old
  // direction), which reads as him planting a foot and pushing back.
  const lean = clamp(o.vx * 0.018, -0.13, 0.13);

  ctx.save();
  ctx.translate(x + PLAYER_W / 2, y + PLAYER_H);   // anchor at the feet
  ctx.rotate(lean);
  ctx.scale(o.face * sx * scale * SPRITE_SCALE, sy * scale * SPRITE_SCALE);

  if (!ewokReady) {
    // Fallback blob so a missing asset doesn't mean a blank screen.
    ctx.fillStyle = C.bark;
    ctx.fillRect(-14, -44, 28, 44);
    ctx.fillStyle = C.maroon;
    ctx.fillRect(-16, -46, 32, 16);
    ctx.restore();
    return;
  }

  ctx.translate(-SPRITE_W / 2, -SPRITE_H);         // into sprite pixel space
  const S = ewokImg;
  const sx0 = (o.skin === undefined ? ewokIndex : o.skin) * SPRITE_W;  // cell in the strip
  const staffW = SPRITE_W - SP.bodyW;

  /* Leg cycle. Two rules keep this comfortable to look at:
     every offset is rounded to a whole art pixel, because the sprite is drawn
     with smoothing off and fractional offsets make the legs shimmer between
     pixels at odd moments; and the legs only ever pull up or sideways, never
     down, so they can't tear a gap at the hip or sink into the branch. */
  const spd = Math.min(Math.abs(o.vx), MAX_VX);
  const cyc = Math.sin(o.anim);
  const amp = 0.5 + spd * 0.30;        // at most ~2 art px of lift
  const tuck  = o.vy < -2 ? 1 : 0;     // knees up on the way up
  const splay = o.vy > 7  ? 1 : 0;     // feet apart on the way down
  const lDY = -Math.round((0.5 + 0.5 * cyc) * amp + tuck);
  const rDY = -Math.round((0.5 - 0.5 * cyc) * amp + tuck);
  const lDX =  Math.round(cyc * spd * 0.10) - splay;
  const rDX = -Math.round(cyc * spd * 0.10) + splay;
  // Head bob stays >= 0 so it can only ever overlap the torso, never gap it.
  const headBob = Math.round((0.5 + 0.5 * Math.sin(o.anim * 0.5)) * 0.8 + o.squash * 1.5);

  // Staff column first (rigid), then the body bands on top of it.
  ctx.drawImage(S, sx0 + SP.bodyW, 0, staffW, SP.headH, SP.bodyW, 0, staffW, SP.headH);
  ctx.drawImage(S, sx0 + SP.bodyW, SP.legsY, staffW, SP.legsH, SP.bodyW, SP.legsY, staffW, SP.legsH);
  // Head
  ctx.drawImage(S, sx0, 0, SP.bodyW, SP.headH, 0, headBob, SP.bodyW, SP.headH);
  // Torso — holds the hand and the grip, so it stays put
  ctx.drawImage(S, sx0, SP.torsoY, SPRITE_W, SP.torsoH, 0, SP.torsoY, SPRITE_W, SP.torsoH);
  // Feet, kicking in antiphase
  ctx.drawImage(S, sx0, SP.legsY, SP.legSplit, SP.legsH,
                   lDX, SP.legsY + lDY, SP.legSplit, SP.legsH);
  ctx.drawImage(S, sx0 + SP.legSplit, SP.legsY, SP.bodyW - SP.legSplit, SP.legsH,
                   SP.legSplit + rDX, SP.legsY + rDY, SP.bodyW - SP.legSplit, SP.legsH);

  ctx.restore();
}

function drawHUD() {
  pixelText(String(score), 14, 12, 40, C.cream, 'left');

  // Mute toggle (also bound to M).
  const m = MUTE_BOX;
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(m.x, m.y, m.w, m.h);
  ctx.fillStyle = C.cream;
  ctx.fillRect(m.x + 6, m.y + 10, 4, 6);       // speaker body
  ctx.fillRect(m.x + 10, m.y + 7, 4, 12);
  if (muted) {
    ctx.fillStyle = C.berry;
    ctx.fillRect(m.x + 15, m.y + 8, 2, 10);
    ctx.fillRect(m.x + 17, m.y + 10, 2, 6);
  } else {
    ctx.fillRect(m.x + 16, m.y + 9, 2, 8);
    ctx.fillRect(m.x + 19, m.y + 6, 2, 14);
  }
}

function panel(y, h) {
  ctx.fillStyle = 'rgba(12, 10, 20, 0.72)';
  ctx.fillRect(30, y, W - 60, h);
  ctx.fillStyle = C.maroon;
  ctx.fillRect(30, y, W - 60, 3);
  ctx.fillRect(30, y + h - 3, W - 60, 3);
}

function drawTitle() {
  const oy = (H - 700) / 2;   // keep the menu centred at any field height
  panel(150 + oy, 448);
  // drop-shadowed chunky title
  pixelText('EWOK', W / 2 + 3, 178 + oy, 88, '#2a1414');
  pixelText('EWOK', W / 2, 175 + oy, 88, C.maroonLt);
  pixelText('HOP',  W / 2 + 3, 243 + oy, 88, '#2a1414');
  pixelText('HOP',  W / 2, 240 + oy, 88, C.cream);

  // bobbing preview Ewok
  const bob = Math.sin(titleTime * 0.05) * 6;
  drawEwok(W / 2 - PLAYER_W / 2, 330 + oy + bob, titleEwok, 1.4);

  // Character picker: arrows either side of the Ewok, name underneath.
  const ax = Math.sin(titleTime * 0.12) > 0 ? 1 : 0;   // gentle nudge on the arrows
  pixelText('<', W / 2 - 74 - ax, 352 + oy, 30, C.cream);
  pixelText('>', W / 2 + 74 + ax, 352 + oy, 30, C.cream);
  pixelText(EWOKS[ewokIndex], W / 2, 396 + oy, 22, '#e0c98a');

  if (Math.sin(titleTime * 0.08) > -0.4) {
    pixelText('PRESS SPACE / TAP', W / 2, 432 + oy, 30, C.cream);
  }
  pixelText('LEFT / RIGHT PICKS EWOK', W / 2, 476 + oy, 20, '#c6b79e');
  pixelText('DRAG OR A D TO MOVE',     W / 2, 504 + oy, 20, '#c6b79e');
  pixelText('BEST ' + highScore,       W / 2, 536 + oy, 22, '#9fd07a');
}

// Hit boxes for the two picker arrows, so they work by click and tap too.
function pickerHit(p) {
  const oy = (H - 700) / 2;
  if (p.y < 340 + oy || p.y > 400 + oy) return 0;
  if (Math.abs(p.x - (W / 2 - 74)) < 34) return -1;
  if (Math.abs(p.x - (W / 2 + 74)) < 34) return 1;
  return 0;
}

function drawGameOver() {
  const oy = (H - 700) / 2;
  panel(185 + oy, 265);
  pixelText('GAME OVER', W / 2, 205 + oy, 52, C.maroonLt);
  pixelText('SCORE ' + score, W / 2, 278 + oy, 34, C.cream);
  pixelText('BEST ' + highScore, W / 2, 322 + oy, 24, '#8fbf6a');
  if (newRecord && Math.sin(overTimer * 0.12) > -0.3) {
    pixelText('NEW HIGH SCORE!', W / 2, 356 + oy, 24, '#ffd97a');
  }
  if (overTimer > 30 && Math.sin(overTimer * 0.07) > -0.4) {
    pixelText('PLAY AGAIN', W / 2, 394 + oy, 30, C.cream);
  }
}

function draw() {
  const scroll = state === 'PLAYING' || state === 'GAME_OVER' ? -camY : titleTime * 0.3;

  ctx.save();
  if (shake > 0) {
    ctx.translate(rand(-shake, shake), rand(-shake, shake));
  }

  drawSky(scroll);
  drawTrees(scroll);
  drawFireflies();

  if (state !== 'TITLE') {
    for (const p of platforms) drawPlatform(p, p.y - camY);
    for (const b of berries)   drawBerry(b, b.y - camY);
    for (const h of hazards)   drawHazard(h, h.y - camY);

    for (const q of particles) {
      ctx.globalAlpha = clamp(q.life / 30, 0, 1);
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y - camY, q.size, q.size);
    }
    ctx.globalAlpha = 1;

    if (state === 'PLAYING') {
      drawEwok(player.x, player.y - camY, player);
    }

    for (const f of floaters) {
      ctx.globalAlpha = clamp(1 - f.life / 60, 0, 1);
      pixelText(f.text, f.x, f.y - camY, 18, f.color);
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();

  if (state === 'TITLE') drawTitle();
  else {
    drawHUD();
    if (state === 'GAME_OVER') drawGameOver();
  }
}

// -----------------------------------------------------------------------------
// 9. GAME LOOP
// -----------------------------------------------------------------------------

titleTime = 0;
let lastTime = performance.now();

function loop(now) {
  // dt is measured in 60fps "frames" and clamped so a background tab or a slow
  // machine can't teleport the Ewok through the level.
  const dt = clamp((now - lastTime) / (1000 / 60), 0, 3);
  lastTime = now;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
