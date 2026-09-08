# Ewok Hop

A small vertical platform-bouncer in the style of Doodle Jump, themed around a
pixel-art Ewok climbing up through the forest canopy of Endor.

Vanilla HTML + CSS + JavaScript, Canvas 2D, no frameworks, no build step, no
dependencies.

## Running it locally

**The simplest way** — double-click `index.html`, or:

```sh
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

That works because everything is plain files with relative paths and there are
no module imports or network requests.

**Or serve it** (identical result, and closer to how it will be deployed):

```sh
npx serve .
# or
python3 -m http.server 8000
```

then open the URL it prints.

## Controls

| | |
|---|---|
| Move | Arrow keys, or `A` / `D` |
| Move (touch) | Drag a finger left/right anywhere on screen |
| Pick a character | Left / right on the title screen, or tap the `<` `>` arrows |
| Start / restart | `Space`, `Enter`, click, or tap |
| Mute | `M`, or the speaker icon in the top-right |

Bouncing is automatic — the Ewok hops whenever he lands on a branch, so you only
ever steer. Falling off the bottom ends the run.

He wraps around the screen edges, but he is never split across them: he is held
fully inside the field, and the moment he reaches one edge he is placed against
the opposite one. Drawing a second copy across the seam would be smoother in the
abstract, but it puts two half-Ewoks on screen at once and reads as a glitch.

## What's in it

- **Platforms** — mossy plank walkways, branches that sway left and right,
  vine-covered logs that crumble a moment after you land on them, and red
  mushrooms that launch you much higher.
- **Difficulty ramp** — as you climb, gaps widen, walkways get narrower, swaying
  branches speed up, and moving/crumbling platforms gradually crowd out the
  solid ones. Bounce mushrooms stay at a constant rate so a run never becomes
  unwinnable.
- **Berries** — collect for +10 and a little pop.
- **Spore clouds** — drift about high up and nibble 5 points on contact. They
  never kill you.
- **Day/night cycle** — the sky walks from dusk through night, dawn, day and
  golden hour as you climb, and loops. Village windows light up after dark.
- **Endor backdrop** — parallax redwood trunks with stilt huts and rope bridges
  strung between them, fireflies, and stars that fade in at night.
- **Four characters** — Wicket, Teebo, Paploo and Logray, each with their own
  fur, hood, headgear and staff. Pick one on the title screen; the choice is
  remembered.
- **Score** — mostly height climbed, plus berries. The high score persists in
  `localStorage`.

## Deploying it as a static site

It's three files and an image, so any static host works. To put it on **GitHub
Pages** and send someone a link:

```sh
git init
git add .
git commit -m "Ewok Hop"
git branch -M main
git remote add origin https://github.com/<you>/ewok-hop.git
git push -u origin main
```

Then in the repo on github.com: **Settings → Pages → Build and deployment →
Source: Deploy from a branch**, pick `main` and `/ (root)`, and save. A minute
later it's live at:

```
https://<you>.github.io/ewok-hop/
```

`index.html` is at the repo root and every path in the project is relative, so
it works from that subdirectory with no configuration. The same files drop
straight onto Netlify (drag the folder onto the dashboard), Vercel, Cloudflare
Pages, or any `nginx`/S3 bucket.

## Files

```
index.html                 canvas element and script tags — that's all
style.css                  page background, the frame around the play field
game.js                    the whole game
assets/ewoks.png           the four characters, 20x27 each, side by side
assets/ewok-reference.png  the original reference art
tools/make_ewoks.py        draws assets/ewoks.png (only needed to change the art)
```

`tools/` is build-time only — the game never touches it, and you don't need
Python to run or deploy anything.

### About the sprites

`assets/ewok-reference.png` is the supplied reference art. It sits on a 36x50
pixel grid, which is a finer grid than everything else in the game — platform
and scenery details are 2-4px blocks — so the character read as though it came
from a different game than the world around it.

The four characters in `assets/ewoks.png` are drawn instead on a 20x27 grid and
blitted at 2x, which puts one art pixel at two logical pixels and lines the
character up with the scenery. They are hand-placed in
`tools/make_ewoks.py` as ASCII grids with a palette per character; the script
also derives the silhouette outline and the interior shading, which is what
keeps them from reading as flat cutouts.

To change the art, edit the grids in that script and re-run it:

```sh
python3 tools/make_ewoks.py      # needs Pillow; rewrites assets/ewoks.png
```

### About the animation

Each character is a single static pose, so `game.js` fakes a rig out of it. The
sprite is drawn as horizontal bands — head, torso, legs — that can be offset
independently, which gives a bobbing head and legs that move in antiphase from
one image. The two legs are separate slices so they can move against each other.
A staff runs the full height of the sprite, so the column it occupies is drawn
rigidly and the moving bands only cover the body — otherwise the shaft would
visibly kink between bands.

Three rules keep it from looking wrong:

- **Every band offset is rounded to a whole art pixel.** The sprite is drawn with
  image smoothing off, so fractional offsets make the legs shimmer between
  pixels at irregular moments.
- **Legs only ever move up or sideways, never down**, so they cannot tear a gap
  at the hip or sink into the branch underfoot. The hip row lives in the rigid
  torso band for the same reason.
- **Turning is an instant one-frame mirror**, the way pixel characters have
  always turned, with a short squash afterwards for weight. Interpolating the
  flip reads as a 3D spin and looks wrong for this art style.

On top of that: squash on landing, stretch while rising, and a lean into the
direction of travel.

## Tuning

The constants at the top of `game.js` are the dials worth touching:
`GRAVITY`, `BOUNCE_VY`, `SUPER_VY` and `MAX_VX` for feel; `GAP_MIN_EASY` /
`GAP_MAX_HARD` and `DIFFICULTY_RUN` for the difficulty curve; `BERRY_CHANCE`
and `HAZARD_CHANCE` for how much stuff is lying around; `PHASE_CLIMB` for how
fast the day/night cycle turns over.

### Why every gap is reachable

A normal bounce lifts `BOUNCE_VY² / (2 · GRAVITY)` ≈ 207px. The generator is
built around that ceiling rather than hoping random placement stays under it:

- The widest gap it will produce is 150px, leaving margin for a missed input.
- `reachX(gap)` works out how far the Ewok can travel sideways during a bounce
  that clears `gap` — air time from the projectile solution, then acceleration
  up to `MAX_VX` — and the next platform's x is drawn from inside that window,
  counting the screen wrap as the shortcut it is.
- Gaps either side of a crumbling log are capped at `CRUMBLE_GAP`, so the hole
  it leaves when it breaks is still jumpable. Without this, the drop across a
  broken log ran to ~250-290px, well past the 207px ceiling: touching one and
  later falling back through it was unsurvivable no matter what you did.
- Never more than two moving/crumbling platforms in a row, and always solid
  footing directly above a crumbling one.
- Swaying branches stay within `sway` px of where they were placed, so they
  cannot drift out of the window the generator promised.

The edge-to-edge wrap only ever makes this easier: crossing via an edge costs
`360 - |a - b|` px of travel where a straight modular wrap would cost
`400 - |a - b|`, so the window the generator draws from stays conservative.
Verified by replaying the real physics — bounce, steer, land — under a grid of
strategies for every consecutive pair: 0 unreachable hops, and 0 unreachable
gaps across a crumbled log.
